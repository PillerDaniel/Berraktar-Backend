import type { IWareHouseRepository } from '../../../domain/iRepositories/IWareHouseRepository.js';
import CheckAvailabilityQuery from './CheckAvailabilityQuery.js';
import { AppError } from '../../../domain/errors/AppError.js';

export default class CheckAvailabilityQueryHandler {
    constructor(private readonly warehouseRepository: IWareHouseRepository) {}

    async handle(query: CheckAvailabilityQuery): Promise<boolean> {
        const { warehouseId, startDate, endDate, type, palletCount } = query;

        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new AppError(
                400,
                'Hibás dátum formátum!',
                'Wrong date format!'
            );
        }

        if (start >= end) {
            throw new AppError(
                400,
                'A kezdő dátumnak korábbinak kell lennie a végdátumnál!',
                'Start date must be before end date!'
            );
        }

        if (!Number.isInteger(palletCount) || palletCount <= 0) {
            throw new AppError(
                400,
                'A raklapok számának legalább 1 egész számnak kell lennie!',
                'Pallet count must be at least 1!'
            );
        }

        return await this.warehouseRepository.CheckAvailability(
            warehouseId,
            start,
            end,
            type,
            palletCount
        );
    }
}
