import type { IBookingRepository } from '../../../domain/iRepositories/IBookingRepository.js';
import type Booking from '../../../domain/models/Booking.js';
import { StoreBookingCommand } from './StoreBookingCommand.js';

export class StoreBookingCommandHandler {
    constructor(private readonly bookingRepository: IBookingRepository) {}

    async handle(command: StoreBookingCommand): Promise<Booking> {
        return await this.bookingRepository.storeBooking(command.bookingId);
    }
}
