import type { IWalletRepository } from '../../domain/iRepositories/IWalletRepository.js';
import Wallet from '../../domain/models/Wallet.js';
import dataSource from '../db/DataSource.js';

export default class WalletRepository implements IWalletRepository {
    private repo = dataSource.getRepository(Wallet);

    async createWallet(wallet: Wallet): Promise<Wallet> {
        const newWallet = this.repo.create(wallet);
        return await this.repo.save(newWallet);
    }

    async getWalletByUserId(userId: string): Promise<Wallet | null> {
        return await this.repo.findOne({
            where: { user: { id: userId } },
        });
    }

    async deposit(userId: string, amount: number): Promise<Wallet | null> {
        return await dataSource.transaction(async (manager) => {
            // Row lock: a concurrent booking payment must not overwrite this.
            const wallet = await manager
                .createQueryBuilder(Wallet, 'wallet')
                .where('"wallet"."userId" = :userId', { userId })
                .setLock('pessimistic_write')
                .getOne();

            if (!wallet) {
                return null;
            }

            wallet.balance = Number(wallet.balance) + amount;
            return await manager.save(wallet);
        });
    }
}
