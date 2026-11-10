import type { IProfileRepository } from '../../../domain/iRepositories/IProfileRepository.js';
import { EditCountryCommand } from './EditCountryCommand.js';

export class EditCountryCommandHandler {
    constructor(private readonly profileRepository: IProfileRepository) {}

    async handle(command: EditCountryCommand): Promise<void> {
        await this.profileRepository.editCountry(
            command.userId,
            command.newCountry
        );
    }
}
