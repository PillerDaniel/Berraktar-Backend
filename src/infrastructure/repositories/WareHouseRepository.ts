import type { IWareHouseRepository } from '../../domain/iRepositories/IWareHouseRepository.js';
import WareHouse from '../../domain/models/WareHouse.js';
import dataSource from '../db/DataSource.js';

export default class WareHouseRepository implements IWareHouseRepository {
    private repo = dataSource.getRepository(WareHouse);

    async createWareHouse(warehouse: WareHouse): Promise<WareHouse> {
        return await this.repo.save(warehouse);
    }

    async getAllWareHouses(): Promise<WareHouse[]> {
        return await this.repo.find();
    }
}
