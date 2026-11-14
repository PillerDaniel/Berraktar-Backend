import express from 'express';
import { body, validationResult } from 'express-validator';
import type { Request, Response } from 'express';

import { container } from '../../application/services/DiContainer.js';

import { WalletController } from '../controllers/WalletController.js';

import authMiddleware from '../middlewares/AuthMiddleware.js';

const walletController: WalletController = new WalletController(
    container.GetWalletQueryHandler,
    container.DepositToWalletCommandHandler
);

const router = express.Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
    return walletController.getWallet(req, res);
});

router.post(
    '/deposit',
    authMiddleware,
    [
        body('amount').isInt({ min: 1, max: 10000000 }).withMessage({
            messageHu:
                'Az összeg 1 és 10 000 000 Ft közötti egész szám kell legyen.',
            messageEn:
                'The amount must be an integer between 1 and 10,000,000 HUF.',
        }),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        return walletController.deposit(req, res);
    }
);

export default router;
