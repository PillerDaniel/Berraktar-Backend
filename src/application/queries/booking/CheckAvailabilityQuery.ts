export default class CheckAvailabilityQuery {
    constructor(
        public readonly warehouseId: string,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly type: 'none' | 'refrigerated',
        public readonly palletCount: number
    ) {}
}
