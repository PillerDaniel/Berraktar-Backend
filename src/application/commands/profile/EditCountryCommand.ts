export class EditCountryCommand {
    constructor(
        public readonly userId: string,
        public readonly newCountry: string
    ) {}
}
