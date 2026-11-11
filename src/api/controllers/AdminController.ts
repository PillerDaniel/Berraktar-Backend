/// <reference path="../../types/express.d.ts" />

import type { Request, Response } from 'express';
import { AppError } from '../../domain/errors/AppError.js';

//commands, handlers, queries
import { GetConfigQueryHandler } from '../../application/queries/config/GetConfigQueryHandler.js';
import { EditConfigCommand } from '../../application/commands/config/EditConfigCommand.js';
import { EditConfigCommandHandler } from '../../application/commands/config/EditConfigCommandHandler.js';
import { CreateWareHouseCommand } from '../../application/commands/warehouse/CreateWareHouseCommand.js';
import { CreateWareHouseCommandHandler } from '../../application/commands/warehouse/CreateWareHouseCommandhandler.js';
import { GetAllWareHouseQueryHandler } from '../../application/queries/warehouse/GetAllWareHouseQueryHandler.js';
import { GetWareHouseByIdQuery } from '../../application/queries/warehouse/GetWareHouseByIdQuery.js';
import { GetWareHouseByIdQueryHandler } from '../../application/queries/warehouse/GetWareHouseByIdQueryHandler.js';
import { EditWareHouseCommand } from '../../application/commands/warehouse/EditWareHouseCommand.js';
import { EditWareHouseCommandHandler } from '../../application/commands/warehouse/EditWareHouseCommandHandler.js';

import Config from '../../domain/models/Config.js';

export class AdminController {
    constructor(
        private readonly getConfigQueryHandler: GetConfigQueryHandler,
        private readonly editConfigCommandHandler: EditConfigCommandHandler,
        private readonly createWareHouseCommandHandler: CreateWareHouseCommandHandler,
        private readonly getAllWareHouseQueryHandler: GetAllWareHouseQueryHandler,
        private readonly getWareHouseByIdQueryHandler: GetWareHouseByIdQueryHandler,
        private readonly editWareHouseCommandHandler: EditWareHouseCommandHandler
    ) {}

    async getConfig(req: Request, res: Response): Promise<void | Response> {
        try {
            const config = await this.getConfigQueryHandler.handle();
            return res.status(200).json({
                config,
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

    async updateConfig(req: Request, res: Response): Promise<void | Response> {
        try {
            const { unitPrice, refrigeratedMultiplier } = req.body;

            if (!unitPrice || !refrigeratedMultiplier) {
                return res.status(400).json({
                    messageHu: 'Az egységár, és szorzó megadása kötelező.',
                    messageEn: 'Unit price and multiplier are required.',
                });
            }

            const conf = new Config();
            conf.unitPrice = unitPrice;
            conf.refrigeratedMultiplier = refrigeratedMultiplier;

            const command = new EditConfigCommand(conf);
            const updatedConfig =
                await this.editConfigCommandHandler.handle(command);

            return res.status(200).json({
                config: updatedConfig,
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

    async createWareHouse(
        req: Request,
        res: Response
    ): Promise<void | Response> {
        try {
            const { country, city, address } = req.body;

            if (!country || !city || !address) {
                return res.status(400).json({
                    messageHu: 'Az ország, város és cím megadása kötelező.',
                    messageEn: 'Country, city and address are required.',
                });
            }

            const command = new CreateWareHouseCommand(country, city, address);
            const newWareHouse =
                await this.createWareHouseCommandHandler.handle(command);

            return res.status(201).json({
                warehouse: newWareHouse,
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

    async EditWareHouseByID(
        req: Request,
        res: Response
    ): Promise<void | Response> {
        try {
            const warehouseId = req.params.id as string;
            const { country, city, address, active } = req.body;

            if (!country || !city || !address || active === undefined) {
                return res.status(400).json({
                    messageHu:
                        'Az ország, város, cím és aktív státusz megadása kötelező.',
                    messageEn:
                        'Country, city, address and active status are required.',
                });
            }

            const command = new EditWareHouseCommand(
                warehouseId,
                country,
                city,
                address,
                active
            );
            await this.editWareHouseCommandHandler.handle(command);

            return res.status(200).json({
                messageHu: 'A raktár sikeresen frissítve lett.',
                messageEn: 'Warehouse updated successfully.',
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
}
