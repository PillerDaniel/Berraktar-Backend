import type {
    ExtendBookingResult,
    IBookingRepository,
} from '../../../domain/iRepositories/IBookingRepository.js';
import type { IConfigRepository } from '../../../domain/iRepositories/IConfigRepository.js';
import loadPricing from '../../utils/LoadPricing.js';
import { ExtendBookingCommand } from './ExtendBookingCommand.js';

export class ExtendBookingCommandHandler {
    constructor(
        private readonly bookingRepository: IBookingRepository,
        private readonly configRepository: IConfigRepository
    ) {}

    async handle(command: ExtendBookingCommand): Promise<ExtendBookingResult> {
        const pricing = await loadPricing(this.configRepository);

        return await this.bookingRepository.extendBooking(
            command.bookingId,
            command.userId,
            command.newEndDate,
            pricing
        );
    }
}
