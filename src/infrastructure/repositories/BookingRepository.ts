import { In, type EntityManager } from 'typeorm';

import type {
    AvailabilityFilter,
    CancelBookingResult,
    CreatePaidBookingInput,
    ExtendBookingResult,
    ExtensionQuote,
    IBookingRepository,
    PaidBookingResult,
} from '../../domain/iRepositories/IBookingRepository.js';
import type { ShelfType } from '../../domain/enums/ShelfType.js';
import { BookingStatus } from '../../domain/enums/BookingStatus.js';
import { InvoiceStatus } from '../../domain/enums/InvoiceStatus.js';
import { ShelfStatus } from '../../domain/enums/ShelfStatus.js';
import { AppError } from '../../domain/errors/AppError.js';
import Booking from '../../domain/models/Booking.js';
import BookingShelf from '../../domain/models/BookingShelf.js';
import Invoice from '../../domain/models/Invoice.js';
import Wallet from '../../domain/models/Wallet.js';
import {
    countBookingDays,
    todayIsoDate,
} from '../../domain/services/BookingPeriod.js';
import { calculateInvoiceAmount } from '../../domain/services/InvoiceCalculator.js';
import type { PricingConfig } from '../../domain/services/InvoiceCalculator.js';
import { allocatePallets } from '../../domain/services/ShelfAllocator.js';
import type { ShelfAvailability } from '../../domain/services/ShelfAllocator.js';
import dataSource from '../db/DataSource.js';

interface AvailabilityRow {
    shelfId: string;
    type: ShelfType;
    capacity: number;
    free: number;
    warehouseId: string;
    country: string;
    city: string;
    address: string;
}

interface ExtensionShelfRow {
    shelfId: string;
    type: ShelfType;
    assignedPallets: number;
    free: number;
}

interface PreparedExtension extends ExtensionQuote {
    booking: Booking;
}

// Bookings in these states still occupy their shelves.
const OCCUPYING_STATUSES = [BookingStatus.PENDING, BookingStatus.STORED];

export default class BookingRepository implements IBookingRepository {
    private repo = dataSource.getRepository(Booking);

    async getShelfAvailability(
        filter: AvailabilityFilter
    ): Promise<ShelfAvailability[]> {
        return await this.queryAvailability(dataSource.manager, filter);
    }

    async createPaidBooking(
        input: CreatePaidBookingInput
    ): Promise<PaidBookingResult> {
        return await dataSource.transaction(async (manager) => {
            // Lock the candidate shelves so two overlapping bookings cannot
            // both see the same free places.
            await manager.query(
                `SELECT s."id" FROM "shelfs" s
                 WHERE s."type"::text = $1
                   AND ($2::uuid IS NULL OR s."warehouseId" = $2::uuid)
                 ORDER BY s."id"
                 FOR UPDATE`,
                [input.type, input.warehouseId]
            );

            const shelves = await this.queryAvailability(manager, input);
            const allocation = allocatePallets(shelves, input.pallets);

            if (!allocation) {
                throw new AppError(
                    409,
                    'There is no free warehouse capacity for the given period.',
                    'A megadott időszakra nincs elegendő szabad raktárterület.'
                );
            }

            const amount = calculateInvoiceAmount(
                countBookingDays(input.startDate, input.endDate),
                allocation.shelves,
                input.pricing
            );

            const wallet = await manager
                .createQueryBuilder(Wallet, 'wallet')
                .where('"wallet"."userId" = :userId', { userId: input.userId })
                .setLock('pessimistic_write')
                .getOne();

            if (!wallet) {
                throw new AppError(
                    404,
                    'Wallet not found.',
                    'A pénztárca nem található.'
                );
            }

            const balance = Number(wallet.balance);

            if (balance < amount) {
                throw new AppError(
                    402,
                    'Payment failed: insufficient wallet balance.',
                    'A fizetés sikertelen: nincs elegendő egyenleg a pénztárcában.'
                );
            }

            wallet.balance = balance - amount;
            await manager.save(wallet);

            const booking = await manager.save(
                manager.create(Booking, {
                    userId: input.userId,
                    startDate: input.startDate,
                    endDate: input.endDate,
                    totalPallets: input.pallets,
                    status: BookingStatus.PENDING,
                })
            );

            await manager.save(
                allocation.shelves.map((shelf) =>
                    manager.create(BookingShelf, {
                        bookingId: booking.id,
                        shelfId: shelf.shelfId,
                        assignedPallets: shelf.assignedPallets,
                    })
                )
            );

            const invoice = await manager.save(
                manager.create(Invoice, {
                    bookingId: booking.id,
                    userId: input.userId,
                    amount,
                    status: InvoiceStatus.PAID,
                })
            );

            return {
                booking,
                invoice,
                warehouse: allocation.warehouse,
                balance: wallet.balance,
            };
        });
    }

    async getBookingsByUserId(userId: string): Promise<Booking[]> {
        return await this.repo.find({
            where: { userId },
            relations: {
                bookingShelfs: { shelf: { warehouse: true } },
                invoices: true,
            },
            order: { startDate: 'DESC' },
        });
    }

    async cancelBooking(
        bookingId: string,
        userId: string
    ): Promise<CancelBookingResult> {
        return await dataSource.transaction(async (manager) => {
            const booking = await this.findBooking(
                manager,
                bookingId,
                userId,
                true
            );

            // once the goods are on the shelves the booking stays
            if (booking.status === BookingStatus.STORED) {
                throw new AppError(
                    409,
                    'A stored booking cannot be cancelled.',
                    'Betárolt foglalás nem mondható le.'
                );
            }

            if (booking.status !== BookingStatus.PENDING) {
                throw new AppError(
                    409,
                    'Only bookings awaiting delivery can be cancelled.',
                    'Csak beszállításra váró foglalás mondható le.'
                );
            }

            // the date at the moment of cancelling decides
            if (booking.startDate <= todayIsoDate()) {
                throw new AppError(
                    409,
                    'A booking can only be cancelled before its start date.',
                    'A foglalás csak a kezdődátum előtt mondható le.'
                );
            }

            const paidInvoices = await manager.find(Invoice, {
                where: { bookingId, status: InvoiceStatus.PAID },
            });
            const refundedAmount = paidInvoices.reduce(
                (sum, invoice) => sum + invoice.amount,
                0
            );

            for (const invoice of paidInvoices) {
                invoice.status = InvoiceStatus.REFUNDED;
            }
            await manager.save(paidInvoices);

            const wallet = await this.lockWallet(manager, userId);
            wallet.balance = Number(wallet.balance) + refundedAmount;
            await manager.save(wallet);

            // a cancelled booking no longer counts as occupying its shelves
            booking.status = BookingStatus.CANCELLED;
            await manager.save(booking);

            return { booking, refundedAmount, balance: wallet.balance };
        });
    }

    async getExtensionQuote(
        bookingId: string,
        userId: string,
        newEndDate: string,
        pricing: PricingConfig
    ): Promise<ExtensionQuote> {
        const { extraDays, amount } = await this.prepareExtension(
            dataSource.manager,
            bookingId,
            userId,
            newEndDate,
            pricing,
            false
        );

        return { extraDays, amount };
    }

    async extendBooking(
        bookingId: string,
        userId: string,
        newEndDate: string,
        pricing: PricingConfig
    ): Promise<ExtendBookingResult> {
        return await dataSource.transaction(async (manager) => {
            const { booking, extraDays, amount } = await this.prepareExtension(
                manager,
                bookingId,
                userId,
                newEndDate,
                pricing,
                true
            );

            const wallet = await this.lockWallet(manager, userId);
            const balance = Number(wallet.balance);

            if (balance < amount) {
                throw new AppError(
                    402,
                    'Payment failed: insufficient wallet balance.',
                    'A fizetés sikertelen: nincs elegendő egyenleg a pénztárcában.'
                );
            }

            // a shortening has a negative amount, so this pays it back
            wallet.balance = balance - amount;
            await manager.save(wallet);

            booking.endDate = newEndDate;
            await manager.save(booking);

            const invoice = await manager.save(
                manager.create(Invoice, {
                    bookingId: booking.id,
                    userId,
                    amount,
                    status: InvoiceStatus.PAID,
                })
            );

            return {
                booking,
                invoice,
                extraDays,
                amount,
                balance: wallet.balance,
            };
        });
    }

    async getInboundBookings(): Promise<Booking[]> {
        return await this.repo.find({
            // pending: waiting for the goods, stored: already on the shelves
            where: { status: In([BookingStatus.PENDING, BookingStatus.STORED]) },
            relations: {
                user: true,
                bookingShelfs: { shelf: { warehouse: true } },
            },
            order: { startDate: 'ASC' },
        });
    }

    async storeBooking(bookingId: string): Promise<Booking> {
        return await dataSource.transaction(async (manager) => {
            const booking = await this.findBooking(
                manager,
                bookingId,
                null,
                true
            );

            if (booking.status !== BookingStatus.PENDING) {
                throw new AppError(
                    409,
                    'Only bookings awaiting delivery can be stored.',
                    'Csak beszállításra váró foglalás tárolható be.'
                );
            }

            booking.status = BookingStatus.STORED;
            await manager.save(booking);

            // the goods are on the shelves now
            await manager.query(
                `UPDATE "shelfs" SET "status" = $2
                 WHERE "status"::text = $3
                   AND "id" IN (
                       SELECT "shelfId" FROM "booking_shelfs"
                       WHERE "bookingId" = $1
                   )`,
                [bookingId, ShelfStatus.ACTIVE, ShelfStatus.UNUSED]
            );

            return booking;
        });
    }

    /** Loads a booking (of the given user, when set), optionally row-locked. */
    private async findBooking(
        manager: EntityManager,
        bookingId: string,
        userId: string | null,
        lock: boolean
    ): Promise<Booking> {
        const query = manager
            .createQueryBuilder(Booking, 'booking')
            .where('booking.id = :bookingId', { bookingId });

        if (userId) {
            query.andWhere('booking.userId = :userId', { userId });
        }
        if (lock) {
            query.setLock('pessimistic_write');
        }

        const booking = await query.getOne();

        if (!booking) {
            throw new AppError(
                404,
                'Booking not found.',
                'A foglalás nem található.'
            );
        }

        return booking;
    }

    private async lockWallet(
        manager: EntityManager,
        userId: string
    ): Promise<Wallet> {
        const wallet = await manager
            .createQueryBuilder(Wallet, 'wallet')
            .where('"wallet"."userId" = :userId', { userId })
            .setLock('pessimistic_write')
            .getOne();

        if (!wallet) {
            throw new AppError(
                404,
                'Wallet not found.',
                'A pénztárca nem található.'
            );
        }

        return wallet;
    }

    /**
     * Validates an extension and prices the added days. The goods stay where
     * they are, so every shelf of the booking must have room for its pallets
     * in the whole added period.
     */
    private async prepareExtension(
        manager: EntityManager,
        bookingId: string,
        userId: string,
        newEndDate: string,
        pricing: PricingConfig,
        lock: boolean
    ): Promise<PreparedExtension> {
        const booking = await this.findBooking(
            manager,
            bookingId,
            userId,
            lock
        );

        if (!OCCUPYING_STATUSES.includes(booking.status)) {
            throw new AppError(
                409,
                'Only active bookings can be changed.',
                'Csak aktív foglalás módosítható.'
            );
        }

        // negative when the booking gets shorter
        const extraDays = countBookingDays(booking.endDate, newEndDate);

        if (extraDays === 0) {
            throw new AppError(
                400,
                'The new end date is the same as the current one.',
                'Az új végdátum megegyezik a jelenlegivel.'
            );
        }

        if (extraDays < 0) {
            const refund = await this.shorteningRefund(
                manager,
                booking,
                newEndDate
            );

            // a negative amount is money going back to the wallet
            return { booking, extraDays, amount: -refund };
        }

        if (lock) {
            await manager.query(
                `SELECT s."id" FROM "shelfs" s
                 WHERE s."id" IN (
                     SELECT "shelfId" FROM "booking_shelfs"
                     WHERE "bookingId" = $1
                 )
                 ORDER BY s."id"
                 FOR UPDATE`,
                [bookingId]
            );
        }

        // free places on the booking's shelves between the old and new end
        const shelves: ExtensionShelfRow[] = await manager.query(
            `SELECT bs."shelfId" AS "shelfId",
                    s."type" AS "type",
                    bs."assignedPallets" AS "assignedPallets",
                    (s."capacity" - COALESCE(
                        SUM(obs."assignedPallets") FILTER (WHERE ob."id" IS NOT NULL),
                        0
                    ))::int AS "free"
             FROM "booking_shelfs" bs
             JOIN "shelfs" s ON s."id" = bs."shelfId"
             LEFT JOIN "booking_shelfs" obs
                    ON obs."shelfId" = s."id"
                   AND obs."bookingId" <> bs."bookingId"
             LEFT JOIN "bookings" ob
                    ON ob."id" = obs."bookingId"
                   AND ob."status"::text = ANY($4::text[])
                   AND ob."startDate" < $3::date
                   AND ob."endDate" > $2::date
             WHERE bs."bookingId" = $1
             GROUP BY bs."id", s."id"`,
            [bookingId, booking.endDate, newEndDate, OCCUPYING_STATUSES]
        );

        if (
            shelves.some(
                (shelf) => Number(shelf.free) < Number(shelf.assignedPallets)
            )
        ) {
            throw new AppError(
                409,
                'The shelves are already booked for the extension period.',
                'A hosszabbítás időszakára a polcok már foglaltak.'
            );
        }

        const amount = calculateInvoiceAmount(
            extraDays,
            shelves.map((shelf) => ({
                type: shelf.type,
                assignedPallets: Number(shelf.assignedPallets),
            })),
            pricing
        );

        return { booking, extraDays, amount };
    }

    /**
     * Money going back when the end date moves earlier: the share of what
     * was paid that belongs to the dropped days.
     */
    private async shorteningRefund(
        manager: EntityManager,
        booking: Booking,
        newEndDate: string
    ): Promise<number> {
        if (booking.startDate <= todayIsoDate()) {
            throw new AppError(
                409,
                'A booking can only be shortened before its start date.',
                'A foglalás csak a kezdődátum előtt rövidíthető.'
            );
        }

        const remainingDays = countBookingDays(booking.startDate, newEndDate);

        if (remainingDays < 1) {
            throw new AppError(
                400,
                'The new end date must be after the start date.',
                'Az új végdátumnak a kezdődátum után kell lennie.'
            );
        }

        const currentDays = countBookingDays(
            booking.startDate,
            booking.endDate
        );
        // earlier shortenings are stored as negative paid invoices
        const paidInvoices = await manager.find(Invoice, {
            where: { bookingId: booking.id, status: InvoiceStatus.PAID },
        });
        const paid = paidInvoices.reduce(
            (sum, invoice) => sum + invoice.amount,
            0
        );

        return Math.round((paid * (currentDays - remainingDays)) / currentDays);
    }

    private async queryAvailability(
        manager: EntityManager,
        filter: AvailabilityFilter
    ): Promise<ShelfAvailability[]> {
        // Two periods overlap when each one starts before the other ends; the
        // end date itself is free again (goods leave that day).
        const rows: AvailabilityRow[] = await manager.query(
            `SELECT s."id" AS "shelfId",
                    s."type" AS "type",
                    s."capacity" AS "capacity",
                    (s."capacity" - COALESCE(
                        SUM(bs."assignedPallets") FILTER (WHERE b."id" IS NOT NULL),
                        0
                    ))::int AS "free",
                    w."id" AS "warehouseId",
                    w."country" AS "country",
                    w."city" AS "city",
                    w."address" AS "address"
             FROM "shelfs" s
             JOIN "warehouses" w ON w."id" = s."warehouseId"
             LEFT JOIN "booking_shelfs" bs ON bs."shelfId" = s."id"
             LEFT JOIN "bookings" b
                    ON b."id" = bs."bookingId"
                   AND b."status"::text = ANY($5::text[])
                   AND b."startDate" < $2::date
                   AND b."endDate" > $1::date
             WHERE w."active" = true
               AND s."status"::text <> $6
               AND s."type"::text = $3
               AND ($4::uuid IS NULL OR w."id" = $4::uuid)
             GROUP BY s."id", w."id"
             ORDER BY w."city", w."address", w."id", s."id"`,
            [
                filter.startDate,
                filter.endDate,
                filter.type,
                filter.warehouseId,
                OCCUPYING_STATUSES,
                ShelfStatus.INACTIVE,
            ]
        );

        return rows.map((row) => ({
            shelfId: row.shelfId,
            type: row.type,
            capacity: Number(row.capacity),
            free: Number(row.free),
            warehouse: {
                id: row.warehouseId,
                country: row.country,
                city: row.city,
                address: row.address,
            },
        }));
    }
}
