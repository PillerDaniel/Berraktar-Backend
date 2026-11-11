import type { IWareHouseRepository } from '../../../domain/iRepositories/IWareHouseRepository.js';
import WareHouse from '../../../domain/models/WareHouse.js';

export class GetAllWareHouseQueryHandler {
    constructor(private readonly wareHouseRepository: IWareHouseRepository) {}

    async handle(): Promise<WareHouse[]> {
        const warehouses = await this.wareHouseRepository.getAllWareHouses();
        return warehouses;
    }
}
