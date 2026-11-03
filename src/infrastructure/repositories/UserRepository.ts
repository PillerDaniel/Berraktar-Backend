import type { IUserRepository } from '../../domain/iRepositories/IUserRepository.js';
import User from '../../domain/models/User.js';
import dataSource from '../db/DataSource.js';

export default class UserRepository implements IUserRepository {
    private repo = dataSource.getRepository(User);

    async createUser(user: User): Promise<User> {
        const newUser = this.repo.create(user);
        return await this.repo.save(newUser);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.repo.findOne({ where: { email } });
        return user || null;
    }
}
