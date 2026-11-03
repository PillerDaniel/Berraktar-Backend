import express from 'express';
import { body, validationResult } from 'express-validator';
import type { Request, Response } from 'express';

import { UserRole } from '../../domain/enums/UserRole.js';

import { container } from '../../application/services/DiContainer.js';
import { AuthController } from '../controllers/AuthController.js';

import authMiddleware from '../middlewares/AuthMiddleware.js';

const authController: AuthController = new AuthController(
    container.createUserHandler,
    container.LoginUserHandler,
    container.LogOutHandler
);

const router = express.Router();

const userRole = UserRole;

// Register route
router.post(
    '/register',
    [
        body('firstName').notEmpty().withMessage({
            messageHu: 'A keresztnév megadása kötelező.',
            messageEn: 'First name is required.',
        }),
        body('lastName').notEmpty().withMessage({
            messageHu: 'A vezetéknév megadása kötelező.',
            messageEn: 'Last name is required.',
        }),
        body('email').isEmail().withMessage({
            messageHu: 'Érvénytelen email cím.',
            messageEn: 'Invalid email address.',
        }),
        body('role').isIn(Object.values(userRole)).withMessage({
            messageHu: 'Érvénytelen szerep.',
            messageEn: 'Invalid role.',
        }),
        body('password')
            .isLength({ min: 8 })
            .withMessage({
                messageHu: 'A jelszó minimum 8 karakter hosszú kell legyen.',
                messageEn: 'Password must be at least 8 characters long.',
            })
            .matches(/[A-Z]/)
            .withMessage({
                messageHu:
                    'A jelszónak tartalmaznia kell legalább egy nagybetűt.',
                messageEn:
                    'Password must contain at least one uppercase letter.',
            })
            .matches(/\d/)
            .withMessage({
                messageHu: 'A jelszónak tartalmaznia kell legalább egy számot.',
                messageEn: 'Password must contain at least one digit.',
            }),
        body('passwordConfirmation').notEmpty().withMessage({
            messageHu: 'A jelszó megerősítése kötelező.',
            messageEn: 'Password confirmation is required.',
        }),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        await authController.register(req, res);
    }
);

//login route
router.post(
    '/login',
    [
        body('email').isEmail().withMessage({
            messageHu: 'Érvénytelen email cím.',
            messageEn: 'Invalid email address.',
        }),
        body('password').notEmpty().withMessage({
            messageHu: 'A jelszó megadása kötelező.',
            messageEn: 'Password is required.',
        }),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }
        await authController.login(req, res);
    }
);

//logout route
router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
    await authController.logout(req, res);
});

//me route
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
    await authController.me(req, res);
});

export default router;
