export class EditPostalCodeCommand {
    constructor(
        public readonly userId: string,
        public readonly newPostalCode: number
    ) {}
}
