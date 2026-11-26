import type { ShelfType } from '../../../domain/enums/ShelfType.js';

export default class CheckAvailabilityQuery {
    constructor(
        public readonly warehouseId: string,
        // 'YYYY-MM-DD', the same as a booking
        public readonly startDate: string,
        public readonly endDate: string,
        public readonly type: ShelfType,
        public readonly palletCount: number
    ) {}
}
