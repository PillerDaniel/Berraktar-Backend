import type { IBookingRepository } from '../../../domain/iRepositories/IBookingRepository.js';
import type Booking from '../../../domain/models/Booking.js';

export class GetInboundBookingsQueryHandler {
    constructor(private readonly bookingRepository: IBookingRepository) {}

    async handle(): Promise<Booking[]> {
        return await this.bookingRepository.getInboundBookings();
    }
}
