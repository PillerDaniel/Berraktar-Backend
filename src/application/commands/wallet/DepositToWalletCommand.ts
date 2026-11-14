export class DepositToWalletCommand {
    constructor(
        public readonly userId: string,
        public readonly amount: number
    ) {}
}
