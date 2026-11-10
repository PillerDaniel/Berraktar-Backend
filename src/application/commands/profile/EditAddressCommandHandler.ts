import type { IProfileRepository } from '../../../domain/iRepositories/IProfileRepository.js';
import { EditAddressCommand } from './EditAddressCommand.js';

export class EditAddressCommandHandler {
    constructor(private readonly profileRepository: IProfileRepository) {}

    async handle(command: EditAddressCommand): Promise<void> {
        await this.profileRepository.editAddress(
            command.userId,
            command.newAddress
        );
    }
}
