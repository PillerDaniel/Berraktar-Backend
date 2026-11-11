import type { IShelfRepository } from '../../domain/iRepositories/IShelfRepository.js';
import Shelf from '../../domain/models/Shelf.js';
import dataSource from '../db/DataSource.js';

export default class ShelfRepository implements IShelfRepository {
    private repo = dataSource.getRepository(Shelf);

    async createShelf(shelf: Shelf): Promise<Shelf> {
        const shel = await this.repo.save(shelf);
        return shel;
    }

    async getShelfById(shelfId: string): Promise<Shelf | null> {
        const shelf = await this.repo.findOneBy({ id: shelfId });
        return shelf;
    }

    async editShelfById(shelfId: string, shelf: Shelf): Promise<Shelf | null> {
        const existingShelf = await this.repo.findOneBy({ id: shelfId });
        if (!existingShelf) {
            return null;
        }

        existingShelf.warehouseId = shelf.warehouseId;
        existingShelf.capacity = shelf.capacity;
        existingShelf.type = shelf.type;
        existingShelf.status = shelf.status;

        const updatedShelf = await this.repo.save(existingShelf);
        return updatedShelf;
    }
}
