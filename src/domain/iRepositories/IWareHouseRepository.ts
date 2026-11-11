import WareHouse from '../models/WareHouse.js';

export interface IWareHouseRepository {
    createWareHouse(warehouse: WareHouse): Promise<WareHouse>;
    getAllWareHouses(): Promise<WareHouse[]>;
}
