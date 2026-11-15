import express from 'express';
import { body, param, validationResult } from 'express-validator';
import type { Request, Response } from 'express';

import { ShelfType } from '../../domain/enums/ShelfType.js';

import { container } from '../../application/services/DiContainer.js';

import { BookingController } from '../controllers/BookingController.js';

import authMiddleware from '../middlewares/AuthMiddleware.js';
import roleMiddleware from '../middlewares/RoleMiddleWare.js';

const bookingController: BookingController = new BookingController(
    container.GetBookingQuoteQueryHandler,
    container.CreateBookingCommandHandler,
    container.GetUserBookingsQueryHandler,
    container.CancelBookingCommandHandler,
    container.GetExtensionQuoteQueryHandler,
    container.ExtendBookingCommandHandler,
    container.GetInboundBookingsQueryHandler,
    container.StoreBookingCommandHandler
);

const router = express.Router();

const tenantRoles = ['user', 'admin'];
const warehouseRoles = ['warehouseman', 'admin'];

// The quote and the booking itself take the same input.
const bookingValidators = [
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
    body('pallets').isInt({ min: 1, max: 100000 }).withMessage({
        messageHu: 'A raklapok száma pozitív egész szám kell legyen.',
        messageEn: 'The number of pallets must be a positive integer.',
    }),
    body('type').optional().isIn(Object.values(ShelfType)).withMessage({
        messageHu: 'Érvénytelen polc típus.',
        messageEn: 'Invalid shelf type.',
    }),
    body('warehouseId').optional({ values: 'falsy' }).isUUID().withMessage({
        messageHu: 'Érvénytelen raktár azonosító.',
        messageEn: 'Invalid warehouse ID.',
    }),
];

router.post(
    '/quote',
    authMiddleware,
    roleMiddleware(tenantRoles),
    bookingValidators,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        return bookingController.getQuote(req, res);
    }
);

router.post(
    '/',
    authMiddleware,
    roleMiddleware(tenantRoles),
    bookingValidators,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        return bookingController.createBooking(req, res);
    }
);

router.get(
    '/',
    authMiddleware,
    roleMiddleware(tenantRoles),
    async (req: Request, res: Response) => {
        return bookingController.getMyBookings(req, res);
    }
);

const bookingIdValidator = param('id').isUUID().withMessage({
    messageHu: 'Érvénytelen foglalás azonosító.',
    messageEn: 'Invalid booking ID.',
});

const newEndDateValidator = body('endDate')
    .isDate({ format: 'YYYY-MM-DD', strictMode: true })
    .withMessage({
        messageHu: 'Érvénytelen végdátum (ÉÉÉÉ-HH-NN).',
        messageEn: 'Invalid end date (YYYY-MM-DD).',
    });

// bookings waiting for the goods to arrive, with the shelves to load
router.get(
    '/inbound',
    authMiddleware,
    roleMiddleware(warehouseRoles),
    async (req: Request, res: Response) => {
        return bookingController.getInboundBookings(req, res);
    }
);

router.post(
    '/:id/store',
    authMiddleware,
    roleMiddleware(warehouseRoles),
    bookingIdValidator,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        return bookingController.storeBooking(req, res);
    }
);

router.post(
    '/:id/cancel',
    authMiddleware,
    roleMiddleware(tenantRoles),
    bookingIdValidator,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        return bookingController.cancelBooking(req, res);
    }
);

router.post(
    '/:id/extend/quote',
    authMiddleware,
    roleMiddleware(tenantRoles),
    [bookingIdValidator, newEndDateValidator],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        return bookingController.getExtensionQuote(req, res);
    }
);

router.post(
    '/:id/extend',
    authMiddleware,
    roleMiddleware(tenantRoles),
    [bookingIdValidator, newEndDateValidator],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        return bookingController.extendBooking(req, res);
    }
);

export default router;
