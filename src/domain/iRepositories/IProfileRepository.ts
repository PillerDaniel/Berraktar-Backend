import Profile from '../models/Profile.js';

export interface IProfileRepository {
    createProfile(profile: Profile): Promise<Profile>;
    getProfileById(userId: string): Promise<Profile>;
}
