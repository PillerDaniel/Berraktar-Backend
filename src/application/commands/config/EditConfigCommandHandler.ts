import type { IConfigRepository } from '../../../domain/iRepositories/IConfigRepository.js';
import Config from '../../../domain/models/Config.js';
import type { EditConfigCommand } from './EditConfigCommand.js';

export class EditConfigCommandHandler {
    constructor(private readonly configRepository: IConfigRepository) {}
    async handle(command: EditConfigCommand): Promise<Config> {
        const config = await this.configRepository.getConfig();
        config.unitPrice = command.newConfig.unitPrice;
        config.refrigeratedMultiplier =
            command.newConfig.refrigeratedMultiplier;
        return await this.configRepository.editConfig(config);
    }
}
