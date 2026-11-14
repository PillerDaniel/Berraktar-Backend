import type { IWalletRepository } from '../../../domain/iRepositories/IWalletRepository.js';
import { AppError } from '../../../domain/errors/AppError.js';
import { DepositToWalletCommand } from './DepositToWalletCommand.js';

export class DepositToWalletCommandHandler {
    constructor(private readonly walletRepository: IWalletRepository) {}

    /** Returns the new balance. */
    async handle(command: DepositToWalletCommand): Promise<number> {
        const wallet = await this.walletRepository.deposit(
            command.userId,
            command.amount
        );

        if (!wallet) {
            throw new AppError(
                404,
                'Wallet not found.',
                'A pénztárca nem található.'
            );
        }

        return Number(wallet.balance);
    }
}
