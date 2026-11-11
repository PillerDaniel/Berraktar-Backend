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

    async getWareHouseById(warehouseId: string): Promise<WareHouse | null> {
        return await this.repo.findOne({
            where: { id: warehouseId },
            relations: {
                shelfs: true,
            },
        });
    }

    async editWareHouseById(
        warehouseId: string,
        warehouse: Partial<WareHouse>
    ): Promise<WareHouse | null> {
        const existingWarehouse = await this.repo.findOneBy({
            id: warehouseId,
        });

        if (!existingWarehouse) {
            return null;
        }

        const updatedWarehouse = this.repo.merge(existingWarehouse, warehouse);
        return await this.repo.save(updatedWarehouse);
    }
}
