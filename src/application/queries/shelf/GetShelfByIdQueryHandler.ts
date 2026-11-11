import type { IShelfRepository } from '../../../domain/iRepositories/IShelfRepository.js';
import { GetShelfByIdQuery } from './GetShelfByIdQuery.js';
import Shelf from '../../../domain/models/Shelf.js';

export class GetShelfByIdQueryHandler {
    constructor(private readonly shelfRepository: IShelfRepository) {}

    async handle(query: GetShelfByIdQuery): Promise<Shelf | null> {
        const shelf = await this.shelfRepository.getShelfById(query.shelfId);
        return shelf;
    }
}
