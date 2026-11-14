import type { IWalletRepository } from '../../../domain/iRepositories/IWalletRepository.js';
import { AppError } from '../../../domain/errors/AppError.js';
import { GetWalletQuery } from './GetWalletQuery.js';

export class GetWalletQueryHandler {
    constructor(private readonly walletRepository: IWalletRepository) {}

    /** Returns the current balance. */
    async handle(query: GetWalletQuery): Promise<number> {
        const wallet = await this.walletRepository.getWalletByUserId(
            query.userId
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
