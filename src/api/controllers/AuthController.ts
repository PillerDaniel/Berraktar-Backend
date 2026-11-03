/// <reference path="../../types/express.d.ts" />
import type { Request, Response } from 'express';
import { AppError } from '../../domain/errors/AppError.js';

import { UserRole } from '../../domain/enums/UserRole.js';

//commands, handlers, queries
import { CreateUserCommand } from '../../application/commands/user/CreateUserCommand.js';
import { CreateUserCommandHandler } from '../../application/commands/user/CreateUserCommandHandler.js';
import { LoginUserCommand } from '../../application/commands/user/LoginUserCommand.js';
import { LoginUserCommandHandler } from '../../application/commands/user/LoginUserCommandHandler.js';
import { LogOutCommand } from '../../application/commands/user/LogOutCommand.js';
import { LogOutCommandHandler } from '../../application/commands/user/LogOutCommandHandler.js';

export class AuthController {
    constructor(
        private readonly createUserCommandHandler: CreateUserCommandHandler,
        private readonly loginUserCommandHandler: LoginUserCommandHandler,
        private readonly logOutCommandHandler: LogOutCommandHandler
    ) {}

    async register(req: Request, res: Response): Promise<void | Response> {
        try {
            const {
                firstName,
                lastName,
                email,
                password,
                passwordConfirmation,
            } = req.body;

            /** 
            const validRoles = Object.values(UserRole); 
             
            if (!validRoles.includes(role)) {
                throw new AppError(
                    400,
                    'Invalid user role.',
                    'Érvénytelen szerepkör.'
                );
            }
                */

            const command = new CreateUserCommand(
                firstName,
                lastName,
                email,
                password,
                passwordConfirmation,
                'user' as UserRole
            );

            const user = await this.createUserCommandHandler.handle(command);
            return res.status(201).json({
                messageHu: 'Sikeres regisztráció.',
                messageEn: 'Registration successful.',
                user: {
                    id: user.id,
                },
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageHu: error.messageHu,
                    messageEn: error.messageEn,
                });
            }

            return res.status(500).json({
                messageHu: 'Szerver hiba.',
                messageEn: 'Server error.',
            });
        }
    }

    async login(req: Request, res: Response): Promise<void | Response> {
        try {
            const { email, password } = req.body;

            const command = new LoginUserCommand(email, password);
            const result = await this.loginUserCommandHandler.handle(command);

            //cookie
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: true, //only https
                sameSite: 'strict',
                maxAge: 3600000, // 1 hour
            });

            return res.status(200).json({
                messageHu: 'Sikeres bejelentkezés.',
                messageEn: 'Login successful.',
                user: result.user,
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageHu: error.messageHu,
                    messageEn: error.messageEn,
                });
            }

            return res.status(500).json({
                messageHu: 'Szerver hiba.',
                messageEn: 'Server error.',
            });
        }
    }

    async logout(req: Request, res: Response): Promise<void | Response> {
        try {
            const sessionId = req.user?.sessionId;
            if (!sessionId) {
                return res.status(400).json({
                    messageHu: 'Nincs érvényes munkamenet.',
                    messageEn: 'No valid session found.',
                });
            }

            const cmd = new LogOutCommand(sessionId);
            await this.logOutCommandHandler.handle(cmd);

            res.clearCookie('token');

            return res.status(200).json({
                messageHu: 'Sikeres kijelentkezés.',
                messageEn: 'Logout successful.',
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageHu: error.messageHu,
                    messageEn: error.messageEn,
                });
            }
        }
    }

    async me(req: Request, res: Response): Promise<void | Response> {
        try {
            if (!req.user) {
                return res.status(401).json({
                    messageHu:
                        'Nincs érvényes token. Kérem jelentkezzen be újra.',
                    messageEn: 'No valid token provided. Please log in again.',
                });
            }
            return res.status(200).json({
                user: req.user,
            });
        } catch (error) {
            res.status(500).json({
                messageHu: 'Szerver hiba.',
                messageEn: 'Server error.',
            });
        }
    }
}
