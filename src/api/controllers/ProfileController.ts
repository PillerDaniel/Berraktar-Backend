/// <reference path="../../types/express.d.ts" />
import type { Request, Response } from 'express';
import { AppError } from '../../domain/errors/AppError.js';
import checkValidIban from '../../application/utils/CheckValidIBAN.js';

//commands, handlers, queries
import { GetUserProfileQuery } from '../../application/queries/profile/GetUserProfileQuery.js';
import { GetUserProfileQueryHandler } from '../../application/queries/profile/GetUserProfileQueryHandler.js';
import { EditCountryCommand } from '../../application/commands/profile/EditCountryCommand.js';
import { EditCountryCommandHandler } from '../../application/commands/profile/EditCountryCommandHandler.js';
import { EditCityCommand } from '../../application/commands/profile/EditCityCommand.js';
import { EditCityCommandHandler } from '../../application/commands/profile/EditCityCommandhandler.js';
import { EditPostalCodeCommand } from '../../application/commands/profile/EditPostalCodeCommand.js';
import { EditPostalCodeCommandHandler } from '../../application/commands/profile/EditPostalCodeCommandHandler.js';
import { EditAddressCommand } from '../../application/commands/profile/EditAddressCommand.js';
import { EditAddressCommandHandler } from '../../application/commands/profile/EditAddressCommandHandler.js';
import { EditBankAccountNumberCommand } from '../../application/commands/profile/EditBankAccountNumberCommand.js';
import { EditBankAccountNumberCommandHandler } from '../../application/commands/profile/EditBankAccountNumberCommandHandler.js';

export class ProfileController {
    constructor(
        private readonly getUserProfileQueryHandler: GetUserProfileQueryHandler,
        private readonly editCountryCommandHandler: EditCountryCommandHandler,
        private readonly editCityCommandHandler: EditCityCommandHandler,
        private readonly editPostalCodeCommandHandler: EditPostalCodeCommandHandler,
        private readonly editAddressCommandHandler: EditAddressCommandHandler,
        private readonly editBankAccountNumberCommandHandler: EditBankAccountNumberCommandHandler
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
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageHu: error.messageHu,
                    messageEn: error.messageEn,
                });
            }
            return res.status(500).json({
                messageHu: 'Szerver hiba történt.',
                messageEn: 'Server error.',
            });
        }
    }

    async editCountry(req: Request, res: Response): Promise<void | Response> {
        try {
            const userId = req.user!.id;
            const { newCountry } = req.body;

            if (!newCountry) {
                throw new AppError(
                    400,
                    'New country is required.',
                    'Az új ország megadása kötelező.'
                );
            }

            const command = new EditCountryCommand(userId, newCountry);
            await this.editCountryCommandHandler.handle(command);

            return res.status(200).json({
                messageHu: 'Ország módosítása sikeres.',
                messageEn: 'Country has been successfully updated.',
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageHu: error.messageHu,
                    messageEn: error.messageEn,
                });
            }
            return res.status(500).json({
                messageHu: 'Szerver hiba történt.',
                messageEn: 'Server error.',
            });
        }
    }

    async editCity(req: Request, res: Response): Promise<void | Response> {
        try {
            const userId = req.user!.id;
            const { newCity } = req.body;

            if (!newCity) {
                throw new AppError(
                    400,
                    'New city is required.',
                    'Az új város megadása kötelező.'
                );
            }

            const command = new EditCityCommand(userId, newCity);
            await this.editCityCommandHandler.handle(command);

            return res.status(200).json({
                messageHu: 'Város módosítása sikeres.',
                messageEn: 'City has been successfully updated.',
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageHu: error.messageHu,
                    messageEn: error.messageEn,
                });
            }
            return res.status(500).json({
                messageHu: 'Szerver hiba történt.',
                messageEn: 'Server error.',
            });
        }
    }

    async editPostalCode(
        req: Request,
        res: Response
    ): Promise<void | Response> {
        try {
            const userId = req.user!.id;
            const { newPostalCode } = req.body;

            if (!newPostalCode) {
                throw new AppError(
                    400,
                    'New postal code is required.',
                    'Az új irányítószám megadása kötelező.'
                );
            }

            const command = new EditPostalCodeCommand(
                userId,
                newPostalCode as number
            );
            await this.editPostalCodeCommandHandler.handle(command);

            return res.status(200).json({
                messageHu: 'Irányítószám módosítása sikeres.',
                messageEn: 'Postal code has been successfully updated.',
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageHu: error.messageHu,
                    messageEn: error.messageEn,
                });
            }
            return res.status(500).json({
                messageHu: 'Szerver hiba történt.',
                messageEn: 'Server error.',
            });
        }
    }

    async editAddress(req: Request, res: Response): Promise<void | Response> {
        try {
            const userId = req.user!.id;
            const { newAddress } = req.body;

            if (!newAddress) {
                throw new AppError(
                    400,
                    'New address is required.',
                    'Az új cím megadása kötelező.'
                );
            }

            const command = new EditAddressCommand(userId, newAddress);
            await this.editAddressCommandHandler.handle(command);

            return res.status(200).json({
                messageHu: 'Cím módosítása sikeres.',
                messageEn: 'Address has been successfully updated.',
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageHu: error.messageHu,
                    messageEn: error.messageEn,
                });
            }
            return res.status(500).json({
                messageHu: 'Szerver hiba történt.',
                messageEn: 'Server error.',
            });
        }
    }

    async editBankAccountNumber(
        req: Request,
        res: Response
    ): Promise<void | Response> {
        try {
            const userId = req.user!.id;
            const { newBankAccountNumber } = req.body;

            if (!newBankAccountNumber) {
                throw new AppError(
                    400,
                    'New bank account number is required.',
                    'Az új bankszámlaszám megadása kötelező.'
                );
            }

            const IBANwithoutSpaces = newBankAccountNumber
                .replace(/\s+/g, '')
                .toUpperCase();

            if (!checkValidIban(IBANwithoutSpaces)) {
                throw new AppError(
                    400,
                    'Invalid IBAN format.',
                    'Érvénytelen IBAN formátum.'
                );
            }

            const command = new EditBankAccountNumberCommand(
                userId,
                IBANwithoutSpaces
            );
            await this.editBankAccountNumberCommandHandler.handle(command);

            return res.status(200).json({
                messageHu: 'Bankszámlaszám módosítása sikeres.',
                messageEn: 'Bank account number has been successfully updated.',
            });
        } catch (error) {
            if (error instanceof AppError) {
                return res.status(error.statusCode).json({
                    messageHu: error.messageHu,
                    messageEn: error.messageEn,
                });
            }
            return res.status(500).json({
                messageHu: 'Szerver hiba történt.',
                messageEn: 'Server error.',
            });
        }
    }
}
