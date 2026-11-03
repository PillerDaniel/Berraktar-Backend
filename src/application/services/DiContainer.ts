//interfaces
import type { IUserRepository } from '../../domain/iRepositories/IUserRepository.js';
import type { IWalletRepository } from '../../domain/iRepositories/IWalletRepository.js';

//session store
import type { ISessionStore } from '../../domain/iRepositories/ISessionStore.js';
import { RedisSessionStore } from '../../infrastructure/repositories/RedisSessionStore.js';

//repositories
import UserRepository from '../../infrastructure/repositories/UserRepository.js';
import WalletRepository from '../../infrastructure/repositories/WalletRepository.js';

//command handlers
import { CreateUserCommandHandler } from '../commands/user/CreateUserCommandHandler.js';
import { LoginUserCommandHandler } from '../commands/user/LoginUserCommandHandler.js';
import { LogOutCommandHandler } from '../commands/user/LogOutCommandHandler.js';

//query handlers

//IServices

//Services

export class DiContainer {
    private static instance: DiContainer;

    //repos
    private _userRepository: IUserRepository | null = null;
    private _walletRepository: IWalletRepository | null = null;

    //session store
    private _sessionStore: ISessionStore | null = null;

    //command handlers
    private _createUserCommandHandler: CreateUserCommandHandler | null = null;
    private _loginUserCommandHandler: LoginUserCommandHandler | null = null;
    private _logOutCommandHandler: LogOutCommandHandler | null = null;

    //query handlers

    private constructor() {}

    public static getInstance(): DiContainer {
        if (!DiContainer.instance) {
            DiContainer.instance = new DiContainer();
        }
        return DiContainer.instance;
    }

    //repositories
    public get userRepository(): IUserRepository {
        if (!this._userRepository) {
            this._userRepository = new UserRepository();
        }
        return this._userRepository;
    }

    public get walletRepository(): IWalletRepository {
        if (!this._walletRepository) {
            this._walletRepository = new WalletRepository();
        }
        return this._walletRepository;
    }

    public get sessionStore(): ISessionStore {
        if (!this._sessionStore) {
            this._sessionStore = new RedisSessionStore();
        }
        return this._sessionStore;
    }

    //command handlers
    public get createUserHandler(): CreateUserCommandHandler {
        if (!this._createUserCommandHandler) {
            this._createUserCommandHandler = new CreateUserCommandHandler(
                this.userRepository,
                this.walletRepository
            );
        }
        return this._createUserCommandHandler;
    }

    public get LoginUserHandler(): LoginUserCommandHandler {
        if (!this._loginUserCommandHandler) {
            this._loginUserCommandHandler = new LoginUserCommandHandler(
                this.userRepository,
                this.sessionStore
            );
        }
        return this._loginUserCommandHandler;
    }

    public get LogOutHandler(): LogOutCommandHandler {
        if (!this._logOutCommandHandler) {
            this._logOutCommandHandler = new LogOutCommandHandler(
                this.sessionStore
            );
        }
        return this._logOutCommandHandler;
    }

    //query handlers
}

export const container = DiContainer.getInstance();
