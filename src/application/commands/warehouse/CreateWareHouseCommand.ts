export class CreateWareHouseCommand {
    constructor(
        public readonly country: string,
        public readonly city: string,
        public readonly address: string
    ) {}
}
