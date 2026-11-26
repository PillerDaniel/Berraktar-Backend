/// <reference path="../../types/express.d.ts" />

import type { Request, Response } from 'express';
import { AppError } from '../../domain/errors/AppError.js';

import { ShelfType } from '../../domain/enums/ShelfType.js';
import { ShelfStatus } from '../../domain/enums/ShelfStatus.js';

import { GetAllWareHouseQueryHandler } from '../../application/queries/warehouse/GetAllWareHouseQueryHandler.js';
import { GetWareHouseByIdQuery } from '../../application/queries/warehouse/GetWareHouseByIdQuery.js';
import { GetWareHouseByIdQueryHandler } from '../../application/queries/warehouse/GetWareHouseByIdQueryHandler.js';
import { GetShelfByIdQuery } from '../../application/queries/shelf/GetShelfByIdQuery.js';
import { GetShelfByIdQueryHandler } from '../../application/queries/shelf/GetShelfByIdQueryHandler.js';
import CheckAvailabilityQuery from '../../application/queries/booking/CheckAvailabilityQuery.js';
import CheckAvailabilityQueryHandler from '../../application/queries/booking/CheckAvailabilityQueryHandler.js';

export class WareHouseController {
    constructor(
        private readonly getAllWareHouseQueryHandler: GetAllWareHouseQueryHandler,
        private readonly getWareHouseByIdQueryHandler: GetWareHouseByIdQueryHandler,
        private readonly checkAvailabilityQueryHandler: CheckAvailabilityQueryHandler,
        private readonly getShelfByIdQueryHandler: GetShelfByIdQueryHandler
    ) {}

    async getAllWareHouses(
        req: Request,
        res: Response
    ): Promise<void | Response> {
        try {
            const warehouses = await this.getAllWareHouseQueryHandler.handle();
            return res.status(200).json({
                warehouses,
            });
        } catch (error) {
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

    async getWareHouseById(
        req: Request,
        res: Response
    ): Promise<void | Response> {
        try {
            const warehouseId = req.params.id as string;
            const query = new GetWareHouseByIdQuery(warehouseId);
            const warehouse =
                await this.getWareHouseByIdQueryHandler.handle(query);

            if (!warehouse) {
                return res.status(404).json({
                    messageHu: 'A raktár nem található.',
                    messageEn: 'Warehouse not found.',
                });
            }

            return res.status(200).json({
                warehouse,
            });
        } catch (error) {
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
    async getShelfById(req: Request, res: Response): Promise<void | Response> {
        try {
            const shelfId = req.params.id as string;
            const query = new GetShelfByIdQuery(shelfId);
            const shelf = await this.getShelfByIdQueryHandler.handle(query);

            if (!shelf) {
                return res.status(404).json({
                    messageHu: 'A polc nem található.',
                    messageEn: 'Shelf not found.',
                });
            }

            return res.status(200).json({
                shelf,
            });
        } catch (error) {
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

    async checkAvailability(
        req: Request,
        res: Response
    ): Promise<void | Response> {
        try {
            const { id, startDate, endDate, type, palletCount } = req.body;

            if (!id || !startDate || !endDate || palletCount === undefined) {
                throw new AppError(
                    400,
                    'Minden mező megadása kötelező!',
                    'All fields are required!'
                );
            }

            const query = new CheckAvailabilityQuery(
                id,
                new Date(startDate),
                new Date(endDate),
                type === 'refrigerated' ? 'refrigerated' : 'none',
                Number(palletCount)
            );

            const isAvailable =
                await this.checkAvailabilityQueryHandler.handle(query);

            return res.status(200).json({
                available: isAvailable,
            });
        } catch (error: any) {
            const statusCode = error.statusCode || 400;
            return res.status(statusCode).json({
                messageHu:
                    error.messageHu ||
                    error.message ||
                    'Hiba a foglalhatóság ellenőrzésekor!',
                messageEn:
                    error.messageEn ||
                    error.message ||
                    'Failed to check warehouse availability!',
            });
        }
    }
}
