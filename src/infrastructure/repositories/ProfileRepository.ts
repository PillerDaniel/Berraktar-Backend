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
}
