/// <reference path="../../types/express.d.ts" />
import type { Request, Response } from 'express';
import { AppError } from '../../domain/errors/AppError.js';

//commands, handlers, queries
import { GetUserProfileQuery } from '../../application/queries/profile/GetUserProfileQuery.js';
import { GetUserProfileQueryHandler } from '../../application/queries/profile/GetUserProfileQueryHandler.js';

export class ProfileController {
    constructor(
        private readonly getUserProfileQueryHandler: GetUserProfileQueryHandler
    ) {}
    async getProfile(req: Request, res: Response): Promise<void | Response> {
        try {
            const userId = req.user!.id;

            const query = new GetUserProfileQuery(userId);
            const profile = await this.getUserProfileQueryHandler.handle(query);

            return res.status(200).json({
                messageHu: 'Profil lekérése sikeres.',
                messageEn: 'Profile query successful.',
                profile: {
                    id: profile.id,
                    country: profile.country,
                    address: profile.address,
                    postalCode: profile.postalCode,
                    city: profile.city,
                    bankAccountNumber: profile.bankAccountNumber,
                },
            });
        } catch (error) {
            console.log('Error in ProfileController.getProfile:', error);
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageHu: error.messageHu,
                    messageEn: error.messageEn,
                });
            }
            return res.status(500).json({
                error: error,
                asd: 'asd',
                messageHu: 'Szerver hiba történt.',
                messageEn: 'An unexpected error occurred.',
            });
        }
    }
}
