export class EditAddressCommand {
    constructor(
        public readonly userId: string,
        public readonly newAddress: string
    ) {}
}
