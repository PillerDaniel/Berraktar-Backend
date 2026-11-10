import type { IProfileRepository } from '../../../domain/iRepositories/IProfileRepository.js';
import { EditCityCommand } from './EditCityCommand.js';

export class EditCityCommandHandler {
    constructor(private readonly profileRepository: IProfileRepository) {}

    async handle(command: EditCityCommand): Promise<void> {
        await this.profileRepository.editCity(command.userId, command.newCity);
    }
}
