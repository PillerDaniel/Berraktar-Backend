import type { UserRole } from '../../../domain/enums/UserRole.js';

export class CreateUserCommand {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly password: string,
        public readonly passwordConfirmation: string,
        public readonly role: UserRole
    ) {}
}
