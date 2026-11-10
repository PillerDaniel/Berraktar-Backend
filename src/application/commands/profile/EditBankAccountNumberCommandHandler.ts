import type { IProfileRepository } from '../../../domain/iRepositories/IProfileRepository.js';
import { EditBankAccountNumberCommand } from './EditBankAccountNumberCommand.js';

export class EditBankAccountNumberCommandHandler {
    constructor(private readonly profileRepository: IProfileRepository) {}

    async handle(command: EditBankAccountNumberCommand): Promise<void> {
        await this.profileRepository.editBankAccountNumber(
            command.userId,
            command.newBankAccountNumber
        );
    }
}
