/// <reference path="../../types/express.d.ts" />

import type { Request, Response } from 'express';
import { AppError } from '../../domain/errors/AppError.js';

//commands, handlers, queries
import { DepositToWalletCommand } from '../../application/commands/wallet/DepositToWalletCommand.js';
import { DepositToWalletCommandHandler } from '../../application/commands/wallet/DepositToWalletCommandHandler.js';
import { GetWalletQuery } from '../../application/queries/wallet/GetWalletQuery.js';
import { GetWalletQueryHandler } from '../../application/queries/wallet/GetWalletQueryHandler.js';

export class WalletController {
    constructor(
        private readonly getWalletQueryHandler: GetWalletQueryHandler,
        private readonly depositToWalletCommandHandler: DepositToWalletCommandHandler
    ) {}

    async getWallet(req: Request, res: Response): Promise<void | Response> {
        try {
            const query = new GetWalletQuery(req.user!.id);
            const balance = await this.getWalletQueryHandler.handle(query);

            return res.status(200).json({
                balance,
            });
        } catch (error) {
            return this.sendError(res, error);
        }
    }

    async deposit(req: Request, res: Response): Promise<void | Response> {
        try {
            const command = new DepositToWalletCommand(
                req.user!.id,
                Number(req.body.amount)
            );
            const balance =
                await this.depositToWalletCommandHandler.handle(command);

            return res.status(200).json({
                balance,
                messageHu: 'Az egyenleg sikeresen feltöltve.',
                messageEn: 'Balance topped up successfully.',
            });
        } catch (error) {
            return this.sendError(res, error);
        }
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
