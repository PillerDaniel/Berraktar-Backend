import bcrypt from 'bcrypt';
import { CreateUserCommand } from './CreateUserCommand.js';
import type { IUserRepository } from '../../../domain/iRepositories/IUserRepository.js';
import type { IWalletRepository } from '../../../domain/iRepositories/IWalletRepository.js';
import User from '../../../domain/models/User.js';
import Wallet from '../../../domain/models/Wallet.js';
import Profile from '../../../domain/models/Profile.js';

import { AppError } from '../../../domain/errors/AppError.js';
import { UserRole } from '../../../domain/enums/UserRole.js';

export class CreateUserCommandHandler {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly walletRepository: IWalletRepository
    ) {}

    async handle(command: CreateUserCommand): Promise<User> {
        const existingUser = await this.userRepository.findByEmail(
            command.email
        );

        if (existingUser) {
            throw new AppError(
                400,
                'User with this email already exists.',
                'Már létezik felhasználó ezzel az email címmel.'
            );
        }

        if (command.password !== command.passwordConfirmation) {
            throw new AppError(
                400,
                'Passwords do not match.',
                'A jelszavak nem egyeznek.'
            );
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(command.password, salt);

        const newUser = new User();
        newUser.firstName = command.firstName;
        newUser.lastName = command.lastName;
        newUser.email = command.email;
        newUser.password = hashedPassword;
        newUser.role = command.role;

        const user = await this.userRepository.createUser(newUser);

        const wallet = new Wallet();
        wallet.user = user;

        const profile = new Profile();
        profile.user = user;

        await this.walletRepository.createWallet(wallet);

        return user;
    }
}
