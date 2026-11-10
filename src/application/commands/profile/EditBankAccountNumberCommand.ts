export class EditBankAccountNumberCommand {
    constructor(
        public readonly userId: string,
        public readonly newBankAccountNumber: string
    ) {}
}
