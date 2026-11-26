import express from 'express';
import { body, validationResult } from 'express-validator';
import type { Request, Response } from 'express';

import { ShelfType } from '../../domain/enums/ShelfType.js';

import { container } from '../../application/services/DiContainer.js';

import { WareHouseController } from '../controllers/WareHouseController.js';

import authMiddleware from '../middlewares/AuthMiddleware.js';

const wareHouseController: WareHouseController = new WareHouseController(
    container.GetAllWareHouseQueryHandler,
    container.GetWareHouseByIdQueryHandler,
    container.CheckAvailabilityQueryHandler,
    container.GetShelfByIdQueryHandler
);

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    return wareHouseController.getAllWareHouses(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
    return wareHouseController.getWareHouseById(req, res);
});

router.get('/shelf/:id', async (req: Request, res: Response) => {
    return wareHouseController.getShelfById(req, res);
});

// the same input rules as a booking quote
const availabilityValidators = [
    body('id').isUUID().withMessage({
        messageHu: 'Érvénytelen raktár azonosító.',
        messageEn: 'Invalid warehouse ID.',
    }),
    body('startDate')
        .isDate({ format: 'YYYY-MM-DD', strictMode: true })
        .withMessage({
            messageHu: 'Érvénytelen kezdődátum (ÉÉÉÉ-HH-NN).',
            messageEn: 'Invalid start date (YYYY-MM-DD).',
        }),
    body('endDate')
        .isDate({ format: 'YYYY-MM-DD', strictMode: true })
        .withMessage({
            messageHu: 'Érvénytelen végdátum (ÉÉÉÉ-HH-NN).',
            messageEn: 'Invalid end date (YYYY-MM-DD).',
        }),
    body('palletCount').isInt({ min: 1, max: 100000 }).withMessage({
        messageHu: 'A raklapok száma pozitív egész szám kell legyen.',
        messageEn: 'The number of pallets must be a positive integer.',
    }),
    body('type').optional().isIn(Object.values(ShelfType)).withMessage({
        messageHu: 'Érvénytelen polc típus.',
        messageEn: 'Invalid shelf type.',
    }),
];

router.post(
    '/availability',
    availabilityValidators,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        return wareHouseController.checkAvailability(req, res);
    }
);

export default router;
