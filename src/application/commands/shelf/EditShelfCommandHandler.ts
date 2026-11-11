import type { IShelfRepository } from '../../../domain/iRepositories/IShelfRepository.js';
import Shelf from '../../../domain/models/Shelf.js';
import { EditShelfCommand } from './EditShelfCommand.js';

export class EditShelfCommandHandler {
    constructor(private readonly shelfRepository: IShelfRepository) {}

    async handle(command: EditShelfCommand): Promise<Shelf | null> {
        const shelf = new Shelf();
        shelf.warehouseId = command.warehouseId;
        shelf.capacity = command.capacity;
        shelf.type = command.type;
        shelf.status = command.status;
        return await this.shelfRepository.editShelfById(command.Id, shelf);
    }
}
