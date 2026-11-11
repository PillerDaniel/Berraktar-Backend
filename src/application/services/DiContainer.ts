//interfaces
import type { IUserRepository } from '../../domain/iRepositories/IUserRepository.js';
import type { IWalletRepository } from '../../domain/iRepositories/IWalletRepository.js';
import type { IProfileRepository } from '../../domain/iRepositories/IProfileRepository.js';
import type { IConfigRepository } from '../../domain/iRepositories/IConfigRepository.js';
import type { IWareHouseRepository } from '../../domain/iRepositories/IWareHouseRepository.js';

//session store
import type { ISessionStore } from '../../domain/iRepositories/ISessionStore.js';
import { RedisSessionStore } from '../../infrastructure/repositories/RedisSessionStore.js';

//repositories
import UserRepository from '../../infrastructure/repositories/UserRepository.js';
import WalletRepository from '../../infrastructure/repositories/WalletRepository.js';
import ProfileRepository from '../../infrastructure/repositories/ProfileRepository.js';
import ConfigRepository from '../../infrastructure/repositories/ConfigRepository.js';
import WareHouseRepository from '../../infrastructure/repositories/WareHouseRepository.js';

//command handlers
import { CreateUserCommandHandler } from '../commands/user/CreateUserCommandHandler.js';
import { LoginUserCommandHandler } from '../commands/user/LoginUserCommandHandler.js';
import { LogOutCommandHandler } from '../commands/user/LogOutCommandHandler.js';

import { EditCountryCommandHandler } from '../commands/profile/EditCountryCommandHandler.js';
import { EditCityCommandHandler } from '../commands/profile/EditCityCommandhandler.js';
import { EditPostalCodeCommandHandler } from '../commands/profile/EditPostalCodeCommandHandler.js';
import { EditAddressCommandHandler } from '../commands/profile/EditAddressCommandHandler.js';
import { EditBankAccountNumberCommandHandler } from '../commands/profile/EditBankAccountNumberCommandHandler.js';

import { EditConfigCommandHandler } from '../commands/config/EditConfigCommandHandler.js';

import { CreateWareHouseCommandHandler } from '../commands/warehouse/CreateWareHouseCommandhandler.js';

//query handlers
import { GetUserProfileQueryHandler } from '../queries/profile/GetUserProfileQueryHandler.js';

import { GetConfigQueryHandler } from '../queries/config/GetConfigQueryHandler.js';

import { GetAllWareHouseQueryHandler } from '../queries/warehouse/GetAllWareHouseQueryHandler.js';

//IServices

//Services

export class DiContainer {
    private static instance: DiContainer;

    //repos
    private _userRepository: IUserRepository | null = null;
    private _walletRepository: IWalletRepository | null = null;
    private _profileRepository: IProfileRepository | null = null;
    private _configRepository: IConfigRepository | null = null;
    private _wareHouseRepository: IWareHouseRepository | null = null;
    //session store
    private _sessionStore: ISessionStore | null = null;

    //command handlers
    private _createUserCommandHandler: CreateUserCommandHandler | null = null;
    private _loginUserCommandHandler: LoginUserCommandHandler | null = null;
    private _logOutCommandHandler: LogOutCommandHandler | null = null;

    private _editCountryCommandHandler: EditCountryCommandHandler | null = null;
    private _editCityCommandHandler: EditCityCommandHandler | null = null;
    private _editPostalCodeCommandHandler: EditPostalCodeCommandHandler | null =
        null;
    private _editAddressCommandHandler: EditAddressCommandHandler | null = null;
    private _editBankAccountNumberCommandHandler: EditBankAccountNumberCommandHandler | null =
        null;
    private _editConfigCommandHandler: EditConfigCommandHandler | null = null;
    private _createWareHouseCommandHandler: CreateWareHouseCommandHandler | null =
        null;

    //query handlers
    private _getUserProfileQueryHandler: GetUserProfileQueryHandler | null =
        null;

    private _getConfigQueryHandler: GetConfigQueryHandler | null = null;
    private _getAllWareHouseQueryHandler: GetAllWareHouseQueryHandler | null =
        null;

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

    public get profileRepository(): IProfileRepository {
        if (!this._profileRepository) {
            this._profileRepository = new ProfileRepository();
        }
        return this._profileRepository;
    }

    public get configRepository(): IConfigRepository {
        if (!this._configRepository) {
            this._configRepository = new ConfigRepository();
        }
        return this._configRepository;
    }

    public get wareHouseRepository(): IWareHouseRepository {
        if (!this._wareHouseRepository) {
            this._wareHouseRepository = new WareHouseRepository();
        }
        return this._wareHouseRepository;
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
                this.walletRepository,
                this.profileRepository
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

    public get EditCountryHandler(): EditCountryCommandHandler {
        if (!this._editCountryCommandHandler) {
            this._editCountryCommandHandler = new EditCountryCommandHandler(
                this.profileRepository
            );
        }
        return this._editCountryCommandHandler;
    }

    public get EditCityHandler(): EditCityCommandHandler {
        if (!this._editCityCommandHandler) {
            this._editCityCommandHandler = new EditCityCommandHandler(
                this.profileRepository
            );
        }
        return this._editCityCommandHandler;
    }

    public get EditPostalCodeHandler(): EditPostalCodeCommandHandler {
        if (!this._editPostalCodeCommandHandler) {
            this._editPostalCodeCommandHandler =
                new EditPostalCodeCommandHandler(this.profileRepository);
        }
        return this._editPostalCodeCommandHandler;
    }

    public get EditAddressHandler(): EditAddressCommandHandler {
        if (!this._editAddressCommandHandler) {
            this._editAddressCommandHandler = new EditAddressCommandHandler(
                this.profileRepository
            );
        }
        return this._editAddressCommandHandler;
    }

    public get EditBankAccountNumberHandler(): EditBankAccountNumberCommandHandler {
        if (!this._editBankAccountNumberCommandHandler) {
            this._editBankAccountNumberCommandHandler =
                new EditBankAccountNumberCommandHandler(this.profileRepository);
        }
        return this._editBankAccountNumberCommandHandler;
    }

    public get EditConfigCommandHandler(): EditConfigCommandHandler {
        if (!this._editConfigCommandHandler) {
            this._editConfigCommandHandler = new EditConfigCommandHandler(
                this.configRepository
            );
        }
        return this._editConfigCommandHandler;
    }

    public get CreateWareHouseCommandHandler(): CreateWareHouseCommandHandler {
        if (!this._createWareHouseCommandHandler) {
            this._createWareHouseCommandHandler =
                new CreateWareHouseCommandHandler(this.wareHouseRepository);
        }
        return this._createWareHouseCommandHandler;
    }

    //query handlers
    public get GetUserProfileQueryHandler(): GetUserProfileQueryHandler {
        if (!this._getUserProfileQueryHandler) {
            this._getUserProfileQueryHandler = new GetUserProfileQueryHandler(
                this.profileRepository
            );
        }
        return this._getUserProfileQueryHandler;
    }

    public get GetConfigQueryHandler(): GetConfigQueryHandler {
        if (!this._getConfigQueryHandler) {
            this._getConfigQueryHandler = new GetConfigQueryHandler(
                this.configRepository
            );
        }
        return this._getConfigQueryHandler;
    }

    public get GetAllWareHouseQueryHandler(): GetAllWareHouseQueryHandler {
        if (!this._getAllWareHouseQueryHandler) {
            this._getAllWareHouseQueryHandler = new GetAllWareHouseQueryHandler(
                this.wareHouseRepository
            );
        }
        return this._getAllWareHouseQueryHandler;
    }
}

export const container = DiContainer.getInstance();
