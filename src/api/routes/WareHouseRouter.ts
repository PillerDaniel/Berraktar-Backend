import express from 'express';
import type { Request, Response } from 'express';

import { container } from '../../application/services/DiContainer.js';

import { WareHouseController } from '../controllers/WareHouseController.js';

import authMiddleware from '../middlewares/AuthMiddleware.js';

const wareHouseController: WareHouseController = new WareHouseController(
    container.GetAllWareHouseQueryHandler,
    container.GetWareHouseByIdQueryHandler,
    container.GetShelfByIdQueryHandler
);

const router = express.Router();

router.get('/', authMiddleware, (req: Request, res: Response) => {
    return wareHouseController.getAllWareHouses(req, res);
});

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
    return wareHouseController.getWareHouseById(req, res);
});

router.get(
    '/shelf/:id',
    authMiddleware,
    async (req: Request, res: Response) => {
        return wareHouseController.getShelfById(req, res);
    }
);

export default router;
