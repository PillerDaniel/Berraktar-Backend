import type { IProfileRepository } from '../../domain/iRepositories/IProfileRepository.js';
import Profile from '../../domain/models/Profile.js';
import dataSource from '../db/DataSource.js';

export default class ProfileRepository implements IProfileRepository {
    private repo = dataSource.getRepository(Profile);

    async getProfileById(userId: string): Promise<Profile> {
        const profile = await this.repo.findOne({
            where: {
                user: { id: userId },
            },
        });
        if (!profile) {
            throw new Error('Profile not found');
        }
        return profile;
    }

    async createProfile(profile: Profile): Promise<Profile> {
        const prof = await this.repo.save(profile);
        return prof;
    }

    async editCountry(userId: string, newCountry: string): Promise<Profile> {
        const profile = await this.getProfileById(userId);
        profile.country = newCountry;
        return await this.repo.save(profile);
    }

    async editAddress(userId: string, newAddress: string): Promise<Profile> {
        const profile = await this.getProfileById(userId);
        profile.address = newAddress;
        return await this.repo.save(profile);
    }

    async editPostalCode(
        userId: string,
        newPostalCode: number
    ): Promise<Profile> {
        const profile = await this.getProfileById(userId);
        profile.postalCode = newPostalCode;
        return await this.repo.save(profile);
    }

    async editCity(userId: string, newCity: string): Promise<Profile> {
        const profile = await this.getProfileById(userId);
        profile.city = newCity;
        return await this.repo.save(profile);
    }

    async editBankAccountNumber(
        userId: string,
        newBankAccountNumber: string
    ): Promise<Profile> {
        const profile = await this.getProfileById(userId);
        profile.bankAccountNumber = newBankAccountNumber;
        return await this.repo.save(profile);
    }
}
