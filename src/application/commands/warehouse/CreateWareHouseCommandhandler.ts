import type { IWareHouseRepository } from '../../../domain/iRepositories/IWareHouseRepository.js';
import { CreateWareHouseCommand } from './CreateWareHouseCommand.js';
import WareHouse from '../../../domain/models/WareHouse.js';

export class CreateWareHouseCommandHandler {
    constructor(private readonly wareHouseRepository: IWareHouseRepository) {}

    async handle(command: CreateWareHouseCommand): Promise<WareHouse> {
        const warehouse = new WareHouse();
        warehouse.country = command.country;
        warehouse.city = command.city;
        warehouse.address = command.address;
        warehouse.active = command.active;

        return await this.wareHouseRepository.createWareHouse(warehouse);
    }
}
