import User from '../../domain/models/User.js';

export interface IUserRepository {
    createUser(user: User): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
}
