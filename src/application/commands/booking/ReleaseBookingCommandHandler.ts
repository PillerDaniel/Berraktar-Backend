import type {
    IBookingRepository,
    ReleaseBookingResult,
} from '../../../domain/iRepositories/IBookingRepository.js';
import type { IConfigRepository } from '../../../domain/iRepositories/IConfigRepository.js';
import loadPricing from '../../utils/LoadPricing.js';
import { ReleaseBookingCommand } from './ReleaseBookingCommand.js';

export class ReleaseBookingCommandHandler {
    constructor(
        private readonly bookingRepository: IBookingRepository,
        private readonly configRepository: IConfigRepository
    ) {}

    async handle(command: ReleaseBookingCommand): Promise<ReleaseBookingResult> {
        const pricing = await loadPricing(this.configRepository);

        return await this.bookingRepository.releaseBooking(
            command.bookingId,
            pricing
        );
    }
}
