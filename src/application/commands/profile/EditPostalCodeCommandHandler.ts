import type { IProfileRepository } from '../../../domain/iRepositories/IProfileRepository.js';
import { EditPostalCodeCommand } from './EditPostalCodeCommand.js';

export class EditPostalCodeCommandHandler {
    constructor(private readonly profileRepository: IProfileRepository) {}

    async handle(command: EditPostalCodeCommand): Promise<void> {
        await this.profileRepository.editPostalCode(
            command.userId,
            command.newPostalCode
        );
    }
}
