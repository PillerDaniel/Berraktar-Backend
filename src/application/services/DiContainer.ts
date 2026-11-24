//interfaces
import type { IUserRepository } from '../../domain/iRepositories/IUserRepository.js';
import type { IWalletRepository } from '../../domain/iRepositories/IWalletRepository.js';
import type { IProfileRepository } from '../../domain/iRepositories/IProfileRepository.js';
import type { IConfigRepository } from '../../domain/iRepositories/IConfigRepository.js';
import type { IWareHouseRepository } from '../../domain/iRepositories/IWareHouseRepository.js';
import type { IShelfRepository } from '../../domain/iRepositories/IShelfRepository.js';
import type { IBookingRepository } from '../../domain/iRepositories/IBookingRepository.js';

//session store
import type { ISessionStore } from '../../domain/iRepositories/ISessionStore.js';
import { RedisSessionStore } from '../../infrastructure/repositories/RedisSessionStore.js';

//repositories
import UserRepository from '../../infrastructure/repositories/UserRepository.js';
import WalletRepository from '../../infrastructure/repositories/WalletRepository.js';
import ProfileRepository from '../../infrastructure/repositories/ProfileRepository.js';
import ConfigRepository from '../../infrastructure/repositories/ConfigRepository.js';
import WareHouseRepository from '../../infrastructure/repositories/WareHouseRepository.js';
import ShelfRepository from '../../infrastructure/repositories/ShelfRepository.js';
import BookingRepository from '../../infrastructure/repositories/BookingRepository.js';

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
import { EditWareHouseCommandHandler } from '../commands/warehouse/EditWareHouseCommandHandler.js';

import { CreateShelfCommandHandler } from '../commands/shelf/CreateShelfCommandHandler.js';
import { EditShelfCommandHandler } from '../commands/shelf/EditShelfCommandHandler.js';

import { CreateBookingCommandHandler } from '../commands/booking/CreateBookingCommandHandler.js';
import { CancelBookingCommandHandler } from '../commands/booking/CancelBookingCommandHandler.js';
import { ExtendBookingCommandHandler } from '../commands/booking/ExtendBookingCommandHandler.js';
import { StoreBookingCommandHandler } from '../commands/booking/StoreBookingCommandHandler.js';
import { ReleaseBookingCommandHandler } from '../commands/booking/ReleaseBookingCommandHandler.js';
import { RelocateBookingCommandHandler } from '../commands/booking/RelocateBookingCommandHandler.js';
import { DepositToWalletCommandHandler } from '../commands/wallet/DepositToWalletCommandHandler.js';

//query handlers
import { GetUserProfileQueryHandler } from '../queries/profile/GetUserProfileQueryHandler.js';

import { GetConfigQueryHandler } from '../queries/config/GetConfigQueryHandler.js';

import { GetAllWareHouseQueryHandler } from '../queries/warehouse/GetAllWareHouseQueryHandler.js';
import { GetWareHouseByIdQueryHandler } from '../queries/warehouse/GetWareHouseByIdQueryHandler.js';

import { GetShelfByIdQueryHandler } from '../queries/shelf/GetShelfByIdQueryHandler.js';

import { GetBookingQuoteQueryHandler } from '../queries/booking/GetBookingQuoteQueryHandler.js';
import { GetUserBookingsQueryHandler } from '../queries/booking/GetUserBookingsQueryHandler.js';
import { GetExtensionQuoteQueryHandler } from '../queries/booking/GetExtensionQuoteQueryHandler.js';
import { GetInboundBookingsQueryHandler } from '../queries/booking/GetInboundBookingsQueryHandler.js';
import { GetOutboundBookingsQueryHandler } from '../queries/booking/GetOutboundBookingsQueryHandler.js';
import { GetWalletQueryHandler } from '../queries/wallet/GetWalletQueryHandler.js';
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
    private _shelfRepository: IShelfRepository | null = null;
    private _bookingRepository: IBookingRepository | null = null;
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
    private _editWareHouseCommandHandler: EditWareHouseCommandHandler | null =
        null;
    private _createShelfCommandHandler: CreateShelfCommandHandler | null = null;
    private _editShelfCommandHandler: EditShelfCommandHandler | null = null;
    private _createBookingCommandHandler: CreateBookingCommandHandler | null =
        null;
    private _depositToWalletCommandHandler: DepositToWalletCommandHandler | null =
        null;
    private _cancelBookingCommandHandler: CancelBookingCommandHandler | null =
        null;
    private _extendBookingCommandHandler: ExtendBookingCommandHandler | null =
        null;
    private _storeBookingCommandHandler: StoreBookingCommandHandler | null =
        null;
    private _releaseBookingCommandHandler: ReleaseBookingCommandHandler | null =
        null;
    private _relocateBookingCommandHandler: RelocateBookingCommandHandler | null =
        null;

    //query handlers
    private _getUserProfileQueryHandler: GetUserProfileQueryHandler | null =
        null;

    private _getConfigQueryHandler: GetConfigQueryHandler | null = null;
    private _getAllWareHouseQueryHandler: GetAllWareHouseQueryHandler | null =
        null;

    private _getWareHouseByIdQueryHandler: GetWareHouseByIdQueryHandler | null =
        null;
    private _getShelfByIdQueryHandler: GetShelfByIdQueryHandler | null = null;
    private _getBookingQuoteQueryHandler: GetBookingQuoteQueryHandler | null =
        null;
    private _getUserBookingsQueryHandler: GetUserBookingsQueryHandler | null =
        null;
    private _getWalletQueryHandler: GetWalletQueryHandler | null = null;
    private _getExtensionQuoteQueryHandler: GetExtensionQuoteQueryHandler | null =
        null;
    private _getInboundBookingsQueryHandler: GetInboundBookingsQueryHandler | null =
        null;
    private _getOutboundBookingsQueryHandler: GetOutboundBookingsQueryHandler | null =
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

    public get shelfRepository(): IShelfRepository {
        if (!this._shelfRepository) {
            this._shelfRepository = new ShelfRepository();
        }
        return this._shelfRepository;
    }

    public get bookingRepository(): IBookingRepository {
        if (!this._bookingRepository) {
            this._bookingRepository = new BookingRepository();
        }
        return this._bookingRepository;
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

    public get EditWareHouseCommandHandler(): EditWareHouseCommandHandler {
        if (!this._editWareHouseCommandHandler) {
            this._editWareHouseCommandHandler = new EditWareHouseCommandHandler(
                this.wareHouseRepository
            );
        }
        return this._editWareHouseCommandHandler;
    }

    public get CreateShelfCommandHandler(): CreateShelfCommandHandler {
        if (!this._createShelfCommandHandler) {
            this._createShelfCommandHandler = new CreateShelfCommandHandler(
                this.shelfRepository
            );
        }
        return this._createShelfCommandHandler;
    }

    public get EditShelfCommandHandler(): EditShelfCommandHandler {
        if (!this._editShelfCommandHandler) {
            this._editShelfCommandHandler = new EditShelfCommandHandler(
                this.shelfRepository
            );
        }
        return this._editShelfCommandHandler;
    }

    public get CreateBookingCommandHandler(): CreateBookingCommandHandler {
        if (!this._createBookingCommandHandler) {
            this._createBookingCommandHandler = new CreateBookingCommandHandler(
                this.bookingRepository,
                this.configRepository
            );
        }
        return this._createBookingCommandHandler;
    }

    public get DepositToWalletCommandHandler(): DepositToWalletCommandHandler {
        if (!this._depositToWalletCommandHandler) {
            this._depositToWalletCommandHandler =
                new DepositToWalletCommandHandler(this.walletRepository);
        }
        return this._depositToWalletCommandHandler;
    }

    public get CancelBookingCommandHandler(): CancelBookingCommandHandler {
        if (!this._cancelBookingCommandHandler) {
            this._cancelBookingCommandHandler = new CancelBookingCommandHandler(
                this.bookingRepository
            );
        }
        return this._cancelBookingCommandHandler;
    }

    public get ExtendBookingCommandHandler(): ExtendBookingCommandHandler {
        if (!this._extendBookingCommandHandler) {
            this._extendBookingCommandHandler = new ExtendBookingCommandHandler(
                this.bookingRepository,
                this.configRepository
            );
        }
        return this._extendBookingCommandHandler;
    }

    public get StoreBookingCommandHandler(): StoreBookingCommandHandler {
        if (!this._storeBookingCommandHandler) {
            this._storeBookingCommandHandler = new StoreBookingCommandHandler(
                this.bookingRepository
            );
        }
        return this._storeBookingCommandHandler;
    }

    public get ReleaseBookingCommandHandler(): ReleaseBookingCommandHandler {
        if (!this._releaseBookingCommandHandler) {
            this._releaseBookingCommandHandler =
                new ReleaseBookingCommandHandler(
                    this.bookingRepository,
                    this.configRepository
                );
        }
        return this._releaseBookingCommandHandler;
    }

    public get RelocateBookingCommandHandler(): RelocateBookingCommandHandler {
        if (!this._relocateBookingCommandHandler) {
            this._relocateBookingCommandHandler =
                new RelocateBookingCommandHandler(this.bookingRepository);
        }
        return this._relocateBookingCommandHandler;
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
    public get GetWareHouseByIdQueryHandler(): GetWareHouseByIdQueryHandler {
        if (!this._getWareHouseByIdQueryHandler) {
            this._getWareHouseByIdQueryHandler =
                new GetWareHouseByIdQueryHandler(this.wareHouseRepository);
        }
        return this._getWareHouseByIdQueryHandler;
    }
    public get GetShelfByIdQueryHandler(): GetShelfByIdQueryHandler {
        if (!this._getShelfByIdQueryHandler) {
            this._getShelfByIdQueryHandler = new GetShelfByIdQueryHandler(
                this.shelfRepository
            );
        }
        return this._getShelfByIdQueryHandler;
    }

    public get GetBookingQuoteQueryHandler(): GetBookingQuoteQueryHandler {
        if (!this._getBookingQuoteQueryHandler) {
            this._getBookingQuoteQueryHandler = new GetBookingQuoteQueryHandler(
                this.bookingRepository,
                this.configRepository
            );
        }
        return this._getBookingQuoteQueryHandler;
    }

    public get GetUserBookingsQueryHandler(): GetUserBookingsQueryHandler {
        if (!this._getUserBookingsQueryHandler) {
            this._getUserBookingsQueryHandler = new GetUserBookingsQueryHandler(
                this.bookingRepository
            );
        }
        return this._getUserBookingsQueryHandler;
    }

    public get GetWalletQueryHandler(): GetWalletQueryHandler {
        if (!this._getWalletQueryHandler) {
            this._getWalletQueryHandler = new GetWalletQueryHandler(
                this.walletRepository
            );
        }
        return this._getWalletQueryHandler;
    }

    public get GetExtensionQuoteQueryHandler(): GetExtensionQuoteQueryHandler {
        if (!this._getExtensionQuoteQueryHandler) {
            this._getExtensionQuoteQueryHandler =
                new GetExtensionQuoteQueryHandler(
                    this.bookingRepository,
                    this.configRepository
                );
        }
        return this._getExtensionQuoteQueryHandler;
    }

    public get GetInboundBookingsQueryHandler(): GetInboundBookingsQueryHandler {
        if (!this._getInboundBookingsQueryHandler) {
            this._getInboundBookingsQueryHandler =
                new GetInboundBookingsQueryHandler(this.bookingRepository);
        }
        return this._getInboundBookingsQueryHandler;
    }

    public get GetOutboundBookingsQueryHandler(): GetOutboundBookingsQueryHandler {
        if (!this._getOutboundBookingsQueryHandler) {
            this._getOutboundBookingsQueryHandler =
                new GetOutboundBookingsQueryHandler(
                    this.bookingRepository,
                    this.configRepository
                );
        }
        return this._getOutboundBookingsQueryHandler;
    }
}

export const container = DiContainer.getInstance();
