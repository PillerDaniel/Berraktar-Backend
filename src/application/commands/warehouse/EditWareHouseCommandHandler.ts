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

        // tenants must never be able to book into the overstay warehouse
        if (warehouse.overstay && command.active) {
            throw new AppError(
                400,
                'The overstay warehouse cannot be opened for bookings.',
                'A túltárolási raktár nem nyitható meg foglalásra.'
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
