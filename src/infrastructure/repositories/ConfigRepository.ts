import type { IConfigRepository } from '../../domain/iRepositories/IConfigRepository.js';
import Config from '../../domain/models/Config.js';
import dataSource from '../db/DataSource.js';

export default class ConfigRepository implements IConfigRepository {
    private repo = dataSource.getRepository(Config);

    async editConfig(config: Config): Promise<Config> {
        return await this.repo.save(config);
    }

    async getConfig(): Promise<Config> {
        const config = await this.repo.find();
        if (!config || config.length === 0) {
            throw new Error('Config not found');
        }
        return config[0] as Config;
    }
}
