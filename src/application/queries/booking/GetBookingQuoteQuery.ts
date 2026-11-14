import type { ShelfType } from '../../../domain/enums/ShelfType.js';

export class GetBookingQuoteQuery {
    constructor(
        public readonly startDate: string,
        public readonly endDate: string,
        public readonly pallets: number,
        public readonly type: ShelfType,
        public readonly warehouseId: string | null
    ) {}
}
