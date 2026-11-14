import type { EntityManager } from 'typeorm';

import type {
    AvailabilityFilter,
    CreatePaidBookingInput,
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
import { countBookingDays } from '../../domain/services/BookingPeriod.js';
import { calculateInvoiceAmount } from '../../domain/services/InvoiceCalculator.js';
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
