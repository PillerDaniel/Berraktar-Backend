import Shelf from '../models/Shelf.js';

export interface IShelfRepository {
    createShelf(shelf: Shelf): Promise<Shelf>;
    editShelfById(shelfId: string, shelf: Shelf): Promise<Shelf | null>;
    getShelfById(shelfId: string): Promise<Shelf | null>;
}
