import type { ShelfType } from '../../../domain/enums/ShelfType.js';

export class CreateBookingCommand {
    constructor(
        public readonly userId: string,
        public readonly startDate: string,
        public readonly endDate: string,
        public readonly pallets: number,
        public readonly type: ShelfType,
        public readonly warehouseId: string | null
    ) {}
}
