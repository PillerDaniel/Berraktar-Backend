import express from 'express';
import type { Request, Response } from 'express';

import { container } from '../../application/services/DiContainer.js';

import { ProfileController } from '../controllers/ProfileController.js';

import authMiddleware from '../middlewares/AuthMiddleware.js';

const profileController: ProfileController = new ProfileController(
    container.GetUserProfileQueryHandler
);

const router = express.Router();

router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
    await profileController.getProfile(req, res);
});

export default router;
