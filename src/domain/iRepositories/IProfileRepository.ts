import Profile from '../models/Profile.js';

export interface IProfileRepository {
    createProfile(profile: Profile): Promise<Profile>;
    getProfileById(userId: string): Promise<Profile>;
    editCountry(userId: string, newCountry: string): Promise<Profile>;
    editAddress(userId: string, newAddress: string): Promise<Profile>;
    editPostalCode(userId: string, newPostalCode: number): Promise<Profile>;
    editCity(userId: string, newCity: string): Promise<Profile>;
    editBankAccountNumber(
        userId: string,
        newBankAccountNumber: string
    ): Promise<Profile>;
}
