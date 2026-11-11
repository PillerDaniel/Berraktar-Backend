import type { IConfigRepository } from '../../../domain/iRepositories/IConfigRepository.js';
import Config from '../../../domain/models/Config.js';

export class GetConfigQueryHandler {
    constructor(private readonly configRepository: IConfigRepository) {}

    async handle(): Promise<Config> {
        const config = await this.configRepository.getConfig();
        return config;
    }
}
