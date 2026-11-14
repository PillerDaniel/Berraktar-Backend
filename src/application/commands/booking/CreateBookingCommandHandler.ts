import type {
    IBookingRepository,
    PaidBookingResult,
} from '../../../domain/iRepositories/IBookingRepository.js';
import type { IConfigRepository } from '../../../domain/iRepositories/IConfigRepository.js';
import { assertValidBookingPeriod } from '../../../domain/services/BookingPeriod.js';
import loadPricing from '../../utils/LoadPricing.js';
import { CreateBookingCommand } from './CreateBookingCommand.js';

export class CreateBookingCommandHandler {
    constructor(
        private readonly bookingRepository: IBookingRepository,
        private readonly configRepository: IConfigRepository
    ) {}

    async handle(command: CreateBookingCommand): Promise<PaidBookingResult> {
        assertValidBookingPeriod(command.startDate, command.endDate);

        const pricing = await loadPricing(this.configRepository);

        return await this.bookingRepository.createPaidBooking({
            userId: command.userId,
            startDate: command.startDate,
            endDate: command.endDate,
            pallets: command.pallets,
            type: command.type,
            warehouseId: command.warehouseId,
            pricing,
        });
    }
}
