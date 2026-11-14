import type { IBookingRepository } from '../../../domain/iRepositories/IBookingRepository.js';
import type Booking from '../../../domain/models/Booking.js';
import { GetUserBookingsQuery } from './GetUserBookingsQuery.js';

export class GetUserBookingsQueryHandler {
    constructor(private readonly bookingRepository: IBookingRepository) {}

    async handle(query: GetUserBookingsQuery): Promise<Booking[]> {
        return await this.bookingRepository.getBookingsByUserId(query.userId);
    }
}
