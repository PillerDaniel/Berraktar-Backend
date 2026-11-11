import WareHouse from '../models/WareHouse.js';

export interface IWareHouseRepository {
    createWareHouse(warehouse: WareHouse): Promise<WareHouse>;
    getAllWareHouses(): Promise<WareHouse[]>;
    getWareHouseById(warehouseId: string): Promise<WareHouse | null>;
    editWareHouseById(
        warehouseId: string,
        warehouse: Partial<WareHouse>
    ): Promise<WareHouse | null>;
}
