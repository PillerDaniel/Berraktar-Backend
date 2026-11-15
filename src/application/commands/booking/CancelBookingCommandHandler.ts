import type {
    CancelBookingResult,
    IBookingRepository,
} from '../../../domain/iRepositories/IBookingRepository.js';
import { CancelBookingCommand } from './CancelBookingCommand.js';

export class CancelBookingCommandHandler {
    constructor(private readonly bookingRepository: IBookingRepository) {}

    async handle(command: CancelBookingCommand): Promise<CancelBookingResult> {
        return await this.bookingRepository.cancelBooking(
            command.bookingId,
            command.userId
        );
    }
}
