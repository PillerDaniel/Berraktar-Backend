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

import Config from '../../domain/models/Config.js';

export class AdminController {
    constructor(
        private readonly getConfigQueryHandler: GetConfigQueryHandler,
        private readonly editConfigCommandHandler: EditConfigCommandHandler,
        private readonly createWareHouseCommandHandler: CreateWareHouseCommandHandler,
        private readonly getAllWareHouseQueryHandler: GetAllWareHouseQueryHandler
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
}
