import type { IWareHouseRepository } from '../../../domain/iRepositories/IWareHouseRepository.js';
import { EditWareHouseCommand } from './EditWareHouseCommand.js';
import { AppError } from '../../../domain/errors/AppError.js';

export class EditWareHouseCommandHandler {
    constructor(private readonly wareHouseRepository: IWareHouseRepository) {}

    async handle(command: EditWareHouseCommand): Promise<void> {
        const warehouse = await this.wareHouseRepository.getWareHouseById(
            command.warehouseId
        );

        if (!warehouse) {
            throw new AppError(
                404,
                'Warehouse not found',
                'A raktár nem található.'
            );
        }

        warehouse.country = command.country;
        warehouse.city = command.city;
        warehouse.address = command.address;
        warehouse.active = command.active;

        await this.wareHouseRepository.editWareHouseById(
            command.warehouseId,
            warehouse
        );
    }
}
