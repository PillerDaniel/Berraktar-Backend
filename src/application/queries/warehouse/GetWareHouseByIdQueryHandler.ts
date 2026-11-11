import type { IWareHouseRepository } from '../../../domain/iRepositories/IWareHouseRepository.js';
import WareHouse from '../../../domain/models/WareHouse.js';
import { GetWareHouseByIdQuery } from './GetWareHouseByIdQuery.js';

export class GetWareHouseByIdQueryHandler {
    constructor(private readonly wareHouseRepository: IWareHouseRepository) {}

    async handle(query: GetWareHouseByIdQuery): Promise<WareHouse | null> {
        return await this.wareHouseRepository.getWareHouseById(
            query.warehouseId
        );
    }
}
