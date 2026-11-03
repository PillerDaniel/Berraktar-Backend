import Wallet from '../models/Wallet.js';

export interface IWalletRepository {
    createWallet(wallet: Wallet): Promise<Wallet>;
}
