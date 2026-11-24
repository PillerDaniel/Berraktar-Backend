/// <reference path="../../types/express.d.ts" />

import type { Request, Response } from 'express';
import { AppError } from '../../domain/errors/AppError.js';

import { ShelfType } from '../../domain/enums/ShelfType.js';
import type Booking from '../../domain/models/Booking.js';

//commands, handlers, queries
import { CreateBookingCommand } from '../../application/commands/booking/CreateBookingCommand.js';
import { CreateBookingCommandHandler } from '../../application/commands/booking/CreateBookingCommandHandler.js';
import { GetBookingQuoteQuery } from '../../application/queries/booking/GetBookingQuoteQuery.js';
import { GetBookingQuoteQueryHandler } from '../../application/queries/booking/GetBookingQuoteQueryHandler.js';
import { GetUserBookingsQuery } from '../../application/queries/booking/GetUserBookingsQuery.js';
import { GetUserBookingsQueryHandler } from '../../application/queries/booking/GetUserBookingsQueryHandler.js';
import { CancelBookingCommand } from '../../application/commands/booking/CancelBookingCommand.js';
import { CancelBookingCommandHandler } from '../../application/commands/booking/CancelBookingCommandHandler.js';
import { ExtendBookingCommand } from '../../application/commands/booking/ExtendBookingCommand.js';
import { ExtendBookingCommandHandler } from '../../application/commands/booking/ExtendBookingCommandHandler.js';
import { StoreBookingCommand } from '../../application/commands/booking/StoreBookingCommand.js';
import { StoreBookingCommandHandler } from '../../application/commands/booking/StoreBookingCommandHandler.js';
import { GetExtensionQuoteQuery } from '../../application/queries/booking/GetExtensionQuoteQuery.js';
import { GetExtensionQuoteQueryHandler } from '../../application/queries/booking/GetExtensionQuoteQueryHandler.js';
import { GetInboundBookingsQueryHandler } from '../../application/queries/booking/GetInboundBookingsQueryHandler.js';
import { GetOutboundBookingsQueryHandler } from '../../application/queries/booking/GetOutboundBookingsQueryHandler.js';
import { ReleaseBookingCommand } from '../../application/commands/booking/ReleaseBookingCommand.js';
import { ReleaseBookingCommandHandler } from '../../application/commands/booking/ReleaseBookingCommandHandler.js';
import { RelocateBookingCommand } from '../../application/commands/booking/RelocateBookingCommand.js';
import { RelocateBookingCommandHandler } from '../../application/commands/booking/RelocateBookingCommandHandler.js';

export class BookingController {
    constructor(
        private readonly getBookingQuoteQueryHandler: GetBookingQuoteQueryHandler,
        private readonly createBookingCommandHandler: CreateBookingCommandHandler,
        private readonly getUserBookingsQueryHandler: GetUserBookingsQueryHandler,
        private readonly cancelBookingCommandHandler: CancelBookingCommandHandler,
        private readonly getExtensionQuoteQueryHandler: GetExtensionQuoteQueryHandler,
        private readonly extendBookingCommandHandler: ExtendBookingCommandHandler,
        private readonly getInboundBookingsQueryHandler: GetInboundBookingsQueryHandler,
        private readonly storeBookingCommandHandler: StoreBookingCommandHandler,
        private readonly getOutboundBookingsQueryHandler: GetOutboundBookingsQueryHandler,
        private readonly releaseBookingCommandHandler: ReleaseBookingCommandHandler,
        private readonly relocateBookingCommandHandler: RelocateBookingCommandHandler
    ) {}

    async getQuote(req: Request, res: Response): Promise<void | Response> {
        try {
            const { startDate, endDate, pallets, type, warehouseId } =
                req.body;

            const query = new GetBookingQuoteQuery(
                startDate,
                endDate,
                Number(pallets),
                type ?? ShelfType.NONE,
                warehouseId || null
            );
            const quote = await this.getBookingQuoteQueryHandler.handle(query);

            return res.status(200).json({
                quote,
            });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async createBooking(req: Request, res: Response): Promise<void | Response> {
        try {
            const userId = req.user!.id;
            const { startDate, endDate, pallets, type, warehouseId } =
                req.body;

            const command = new CreateBookingCommand(
                userId,
                startDate,
                endDate,
                Number(pallets),
                type ?? ShelfType.NONE,
                warehouseId || null
            );
            const { booking, invoice, warehouse, balance } =
                await this.createBookingCommandHandler.handle(command);

            return res.status(201).json({
                booking: {
                    id: booking.id,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    totalPallets: booking.totalPallets,
                    status: booking.status,
                    warehouse,
                },
                invoice: {
                    id: invoice.id,
                    amount: invoice.amount,
                    status: invoice.status,
                    issuedAt: invoice.issuedAt,
                },
                balance,
                messageHu: 'A foglalás sikeresen létrejött, a fizetés megtörtént.',
                messageEn: 'Booking created and paid successfully.',
            });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async getMyBookings(req: Request, res: Response): Promise<void | Response> {
        try {
            const query = new GetUserBookingsQuery(req.user!.id);
            const bookings =
                await this.getUserBookingsQueryHandler.handle(query);

            return res.status(200).json({
                bookings: bookings.map((booking) => this.toResponse(booking)),
            });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async cancelBooking(req: Request, res: Response): Promise<void | Response> {
        try {
            const command = new CancelBookingCommand(
                String(req.params.id),
                req.user!.id
            );
            const { booking, refundedAmount, balance } =
                await this.cancelBookingCommandHandler.handle(command);

            return res.status(200).json({
                booking: { id: booking.id, status: booking.status },
                refundedAmount,
                balance,
                messageHu:
                    'A foglalás lemondva, az összeget visszatérítettük az egyenlegre.',
                messageEn:
                    'Booking cancelled, the amount was refunded to your balance.',
            });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async getExtensionQuote(
        req: Request,
        res: Response
    ): Promise<void | Response> {
        try {
            const query = new GetExtensionQuoteQuery(
                String(req.params.id),
                req.user!.id,
                req.body.endDate
            );
            const quote = await this.getExtensionQuoteQueryHandler.handle(query);

            return res.status(200).json({
                quote,
            });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async extendBooking(req: Request, res: Response): Promise<void | Response> {
        try {
            const command = new ExtendBookingCommand(
                String(req.params.id),
                req.user!.id,
                req.body.endDate
            );
            const { booking, invoice, extraDays, amount, balance } =
                await this.extendBookingCommandHandler.handle(command);

            return res.status(200).json({
                booking: {
                    id: booking.id,
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    status: booking.status,
                },
                invoice: {
                    id: invoice.id,
                    amount: invoice.amount,
                    status: invoice.status,
                    issuedAt: invoice.issuedAt,
                },
                extraDays,
                amount,
                balance,
                messageHu:
                    amount < 0
                        ? 'A foglalás lerövidítve, a különbözetet visszatérítettük az egyenlegre.'
                        : 'A foglalás meghosszabbítva, a különbözet kifizetve.',
                messageEn:
                    amount < 0
                        ? 'Booking shortened, the difference was refunded to your balance.'
                        : 'Booking extended, the difference has been paid.',
            });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async getInboundBookings(
        req: Request,
        res: Response
    ): Promise<void | Response> {
        try {
            const bookings = await this.getInboundBookingsQueryHandler.handle();

            return res.status(200).json({
                bookings: bookings.map((booking) =>
                    this.toWarehouseResponse(booking)
                ),
            });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async getOutboundBookings(
        req: Request,
        res: Response
    ): Promise<void | Response> {
        try {
            const items = await this.getOutboundBookingsQueryHandler.handle();

            return res.status(200).json({
                bookings: items.map(({ booking, overdueDays, overstayFee }) => ({
                    ...this.toWarehouseResponse(booking),
                    overdueDays,
                    overstayFee,
                })),
            });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async releaseBooking(
        req: Request,
        res: Response
    ): Promise<void | Response> {
        try {
            const command = new ReleaseBookingCommand(String(req.params.id));
            const { booking, overdueDays, overstayFee, invoice } =
                await this.releaseBookingCommandHandler.handle(command);

            return res.status(200).json({
                booking: {
                    id: booking.id,
                    status: booking.status,
                    releasedAt: booking.releasedAt,
                },
                overdueDays,
                overstayFee,
                invoice: invoice
                    ? {
                          id: invoice.id,
                          amount: invoice.amount,
                          status: invoice.status,
                          issuedAt: invoice.issuedAt,
                      }
                    : null,
                messageHu:
                    overstayFee > 0
                        ? 'Az áru kitárolva, a túltárolási díjat levontuk a bérlő egyenlegéből, a bérlet lezárva.'
                        : 'Az áru kitárolva, a bérlet lezárva.',
                messageEn:
                    overstayFee > 0
                        ? "The goods have been taken out, the overstay fee was charged to the tenant's balance and the booking is closed."
                        : 'The goods have been taken out and the booking is closed.',
            });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async relocateBooking(
        req: Request,
        res: Response
    ): Promise<void | Response> {
        try {
            const command = new RelocateBookingCommand(
                String(req.params.id),
                req.body.warehouseId
            );
            const { booking, warehouse } =
                await this.relocateBookingCommandHandler.handle(command);

            return res.status(200).json({
                booking: { id: booking.id, status: booking.status },
                warehouse,
                messageHu: 'A raklapok áthelyezve a kiválasztott raktárba.',
                messageEn: 'The pallets have been moved to the selected warehouse.',
            });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    /** A booking as the warehouse staff sees it: tenant, place and shelves. */
    private toWarehouseResponse(booking: Booking) {
        const warehouse = booking.bookingShelfs[0]?.shelf.warehouse;

        return {
            id: booking.id,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalPallets: booking.totalPallets,
            status: booking.status,
            type: booking.bookingShelfs[0]?.shelf.type ?? ShelfType.NONE,
            tenant: {
                firstName: booking.user.firstName,
                lastName: booking.user.lastName,
                email: booking.user.email,
            },
            warehouse: warehouse
                ? {
                      id: warehouse.id,
                      country: warehouse.country,
                      city: warehouse.city,
                      address: warehouse.address,
                      overstay: warehouse.overstay,
                  }
                : null,
            shelves: booking.bookingShelfs.map((bookingShelf) => ({
                shelfId: bookingShelf.shelfId,
                type: bookingShelf.shelf.type,
                capacity: bookingShelf.shelf.capacity,
                assignedPallets: bookingShelf.assignedPallets,
            })),
        };
    }

    async storeBooking(req: Request, res: Response): Promise<void | Response> {
        try {
            const command = new StoreBookingCommand(String(req.params.id));
            const booking =
                await this.storeBookingCommandHandler.handle(command);

            return res.status(200).json({
                booking: { id: booking.id, status: booking.status },
                messageHu: 'Az áru betárolva.',
                messageEn: 'The goods have been stored.',
            });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    private toResponse(booking: Booking) {
        const warehouse = booking.bookingShelfs[0]?.shelf.warehouse;
        // the first invoice is the booking itself, the rest are extensions
        const invoices = [...booking.invoices].sort(
            (a, b) => a.issuedAt.getTime() - b.issuedAt.getTime()
        );
        const invoice = invoices[0];

        return {
            id: booking.id,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalPallets: booking.totalPallets,
            status: booking.status,
            releasedAt: booking.releasedAt,
            type: booking.bookingShelfs[0]?.shelf.type ?? ShelfType.NONE,
            warehouse: warehouse
                ? {
                      id: warehouse.id,
                      country: warehouse.country,
                      city: warehouse.city,
                      address: warehouse.address,
                      overstay: warehouse.overstay,
                  }
                : null,
            shelves: booking.bookingShelfs.map((bookingShelf) => ({
                shelfId: bookingShelf.shelfId,
                assignedPallets: bookingShelf.assignedPallets,
            })),
            invoice: invoice
                ? {
                      id: invoice.id,
                      amount: invoice.amount,
                      status: invoice.status,
                      issuedAt: invoice.issuedAt,
                  }
                : null,
            invoices: invoices.map((item) => ({
                id: item.id,
                amount: item.amount,
                status: item.status,
                issuedAt: item.issuedAt,
                overstay: item.overstay,
            })),
            totalAmount: invoices.reduce((sum, item) => sum + item.amount, 0),
        };
    }

    private sendError(res: Response, error: unknown): Response {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({
                messageHu: error.messageHu,
                messageEn: error.messageEn,
            });
        }

        return res.status(500).json({
            messageHu: 'Szerver hiba.',
            messageEn: 'Server error.',
        });
    }
}
