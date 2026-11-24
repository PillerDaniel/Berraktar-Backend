import type {
    IBookingRepository,
    RelocateBookingResult,
} from '../../../domain/iRepositories/IBookingRepository.js';
import { RelocateBookingCommand } from './RelocateBookingCommand.js';

export class RelocateBookingCommandHandler {
    constructor(private readonly bookingRepository: IBookingRepository) {}

    async handle(
        command: RelocateBookingCommand
    ): Promise<RelocateBookingResult> {
        return await this.bookingRepository.relocateBooking(
            command.bookingId,
            command.warehouseId
        );
    }
}
