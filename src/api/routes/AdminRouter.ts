import express from 'express';
import type { Request, Response } from 'express';

import { container } from '../../application/services/DiContainer.js';

import { AdminController } from '../controllers/AdminController.js';

import authMiddleware from '../middlewares/AuthMiddleware.js';
import roleMiddleware from '../middlewares/RoleMiddleWare.js';

const adminController: AdminController = new AdminController(
    container.GetConfigQueryHandler,
    container.EditConfigCommandHandler,
    container.CreateWareHouseCommandHandler,
    container.GetAllWareHouseQueryHandler,
    container.GetWareHouseByIdQueryHandler,
    container.EditWareHouseCommandHandler,
    container.CreateShelfCommandHandler,
    container.GetShelfByIdQueryHandler,
    container.EditShelfCommandHandler
);

const router = express.Router();

router.get(
    '/config',
    authMiddleware,
    roleMiddleware(['admin']),
    (req: Request, res: Response) => {
        return adminController.getConfig(req, res);
    }
);

router.put(
    '/config',
    authMiddleware,
    roleMiddleware(['admin']),
    (req: Request, res: Response) => {
        return adminController.updateConfig(req, res);
    }
);

router.post(
    '/warehouse',
    authMiddleware,
    roleMiddleware(['admin']),
    (req: Request, res: Response) => {
        return adminController.createWareHouse(req, res);
    }
);

router.get(
    '/warehouse',
    authMiddleware,
    roleMiddleware(['admin']),
    (req: Request, res: Response) => {
        return adminController.getAllWareHouses(req, res);
    }
);

router.get(
    '/warehouse/:id',
    authMiddleware,
    roleMiddleware(['admin']),
    async (req: Request, res: Response) => {
        return adminController.getWareHouseById(req, res);
    }
);

router.put(
    '/warehouse/:id',
    authMiddleware,
    roleMiddleware(['admin']),
    async (req: Request, res: Response) => {
        return adminController.EditWareHouseByID(req, res);
    }
);

router.post(
    '/shelf',
    authMiddleware,
    roleMiddleware(['admin']),
    async (req: Request, res: Response) => {
        return adminController.createShelf(req, res);
    }
);

router.get(
    '/shelf/:id',
    authMiddleware,
    roleMiddleware(['admin']),
    async (req: Request, res: Response) => {
        return adminController.getShelfById(req, res);
    }
);

router.put(
    '/shelf/:id',
    authMiddleware,
    roleMiddleware(['admin']),
    async (req: Request, res: Response) => {
        return adminController.editShelfById(req, res);
    }
);

export default router;
