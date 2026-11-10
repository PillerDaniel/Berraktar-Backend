export class EditCityCommand {
    constructor(
        public readonly userId: string,
        public readonly newCity: string
    ) {}
}
