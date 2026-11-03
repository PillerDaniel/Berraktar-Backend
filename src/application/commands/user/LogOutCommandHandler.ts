import type { ISessionStore } from '../../../domain/iRepositories/ISessionStore.js';
import { LogOutCommand } from './LogOutCommand.js';

export class LogOutCommandHandler {
    constructor(private readonly sessionStore: ISessionStore) {}
    async handle(command: LogOutCommand): Promise<void> {
        await this.sessionStore.deleteSession(command.redisSessionId);
    }
}
