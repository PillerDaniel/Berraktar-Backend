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

export class BookingController {
    constructor(
        private readonly getBookingQuoteQueryHandler: GetBookingQuoteQueryHandler,
        private readonly createBookingCommandHandler: CreateBookingCommandHandler,
        private readonly getUserBookingsQueryHandler: GetUserBookingsQueryHandler
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

    private toResponse(booking: Booking) {
        const warehouse = booking.bookingShelfs[0]?.shelf.warehouse;
        const invoice = booking.invoices[0];

        return {
            id: booking.id,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalPallets: booking.totalPallets,
            status: booking.status,
            type: booking.bookingShelfs[0]?.shelf.type ?? ShelfType.NONE,
            warehouse: warehouse
                ? {
                      id: warehouse.id,
                      country: warehouse.country,
                      city: warehouse.city,
                      address: warehouse.address,
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
