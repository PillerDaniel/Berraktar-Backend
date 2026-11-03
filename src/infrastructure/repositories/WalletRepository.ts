import type { IWalletRepository } from '../../domain/iRepositories/IWalletRepository.js';
import Wallet from '../../domain/models/Wallet.js';
import dataSource from '../db/DataSource.js';

export default class WalletRepository implements IWalletRepository {
    private repo = dataSource.getRepository(Wallet);

    async createWallet(wallet: Wallet): Promise<Wallet> {
        const newWallet = this.repo.create(wallet);
        return await this.repo.save(newWallet);
    }
}
