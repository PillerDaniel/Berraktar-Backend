import type { IProfileRepository } from '../../../domain/iRepositories/IProfileRepository.js';
import { GetUserProfileQuery } from './GetUserProfileQuery.js';
import Profile from '../../../domain/models/Profile.js';

export class GetUserProfileQueryHandler {
    constructor(private readonly profileRepository: IProfileRepository) {}

    async handle(query: GetUserProfileQuery): Promise<Profile> {
        const profile = await this.profileRepository.getProfileById(
            query.userId
        );
        return profile;
    }
}
