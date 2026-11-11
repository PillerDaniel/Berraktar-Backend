import type { IShelfRepository } from '../../../domain/iRepositories/IShelfRepository.js';
import Shelf from '../../../domain/models/Shelf.js';
import { CreateShelfCommand } from './CreateShelfCommand.js';

export class CreateShelfCommandHandler {
    constructor(private readonly shelfRepository: IShelfRepository) {}

    async handle(command: CreateShelfCommand): Promise<Shelf> {
        const shelf = new Shelf();
        shelf.warehouseId = command.warehouseId;
        shelf.capacity = command.capacity;
        shelf.type = command.type;
        shelf.status = command.status;
        return await this.shelfRepository.createShelf(shelf);
    }
}
