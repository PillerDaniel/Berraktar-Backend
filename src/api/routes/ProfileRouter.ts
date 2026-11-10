import express from 'express';
import type { Request, Response } from 'express';

import { container } from '../../application/services/DiContainer.js';

import { ProfileController } from '../controllers/ProfileController.js';

import authMiddleware from '../middlewares/AuthMiddleware.js';

const profileController: ProfileController = new ProfileController(
    container.GetUserProfileQueryHandler,
    container.EditCountryHandler,
    container.EditCityHandler,
    container.EditPostalCodeHandler,
    container.EditAddressHandler,
    container.EditBankAccountNumberHandler
);

const router = express.Router();

router.get('/', authMiddleware, async (req: Request, res: Response) => {
    await profileController.getProfile(req, res);
});

router.patch(
    '/country',
    authMiddleware,
    async (req: Request, res: Response) => {
        await profileController.editCountry(req, res);
    }
);

router.patch('/city', authMiddleware, async (req: Request, res: Response) => {
    await profileController.editCity(req, res);
});

router.patch(
    '/postal-code',
    authMiddleware,
    async (req: Request, res: Response) => {
        await profileController.editPostalCode(req, res);
    }
);

router.patch(
    '/address',
    authMiddleware,
    async (req: Request, res: Response) => {
        await profileController.editAddress(req, res);
    }
);

router.patch(
    '/bank-account-number',
    authMiddleware,
    async (req: Request, res: Response) => {
        await profileController.editBankAccountNumber(req, res);
    }
);

export default router;
