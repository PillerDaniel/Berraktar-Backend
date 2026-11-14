import Wallet from '../models/Wallet.js';

export interface IWalletRepository {
    createWallet(wallet: Wallet): Promise<Wallet>;
    getWalletByUserId(userId: string): Promise<Wallet | null>;
    /** Adds the amount to the user's balance; null when the user has no wallet. */
    deposit(userId: string, amount: number): Promise<Wallet | null>;
}
