export class EditWareHouseCommand {
    constructor(
        public readonly warehouseId: string,
        public readonly country: string,
        public readonly city: string,
        public readonly address: string,
        public readonly active: boolean
    ) {}
}
