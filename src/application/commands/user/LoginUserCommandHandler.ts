import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import config from 'config';

import { LoginUserCommand } from './LoginUserCommand.js';

import type { IUserRepository } from '../../../domain/iRepositories/IUserRepository.js';
import type { ISessionStore } from '../../../domain/iRepositories/ISessionStore.js';

import { AppError } from '../../../domain/errors/AppError.js';

const JWT_SECRET = config.get<string>('Auth.JWTSECRET');

export class LoginUserCommandHandler {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly sessionStore: ISessionStore
    ) {}

    async handle(
        command: LoginUserCommand
    ): Promise<{ token: string; user: { role: string; email: string } }> {
        const user = await this.userRepository.findByEmail(command.email);

        if (!user) {
            throw new AppError(
                401,
                'Invalid email or password.',
                'Érvénytelen email vagy jelszó.'
            );
        }

        const isPwMatch = await bcrypt.compare(command.password, user.password);

        if (!isPwMatch) {
            throw new AppError(
                401,
                'Invalid email or password.',
                'Érvénytelen email vagy jelszó.'
            );
        }

        if (!user.active) {
            throw new AppError(
                401,
                'User banned.',
                'A felhasználó kitiltásra került.'
            );
        }

        const sessionId = await this.sessionStore.createSession(
            user.id,
            user.role,
            user.email
        );

        const token = JWT.sign(
            {
                sid: sessionId,
            },
            JWT_SECRET,
            {
                expiresIn: '1h',
            }
        );

        return {
            token: token,
            user: { email: user.email, role: user.role },
        };
    }
}
