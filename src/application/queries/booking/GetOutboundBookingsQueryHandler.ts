import type { IBookingRepository } from '../../../domain/iRepositories/IBookingRepository.js';
import type { IConfigRepository } from '../../../domain/iRepositories/IConfigRepository.js';
import type Booking from '../../../domain/models/Booking.js';
import { countOverdueDays } from '../../../domain/services/BookingPeriod.js';
import { calculateOverstayFee } from '../../../domain/services/InvoiceCalculator.js';
import loadPricing from '../../utils/LoadPricing.js';

export interface OutboundBooking {
    booking: Booking;
    overdueDays: number;
    // what taking the goods out today would cost the tenant
    overstayFee: number;
}

export class GetOutboundBookingsQueryHandler {
    constructor(
        private readonly bookingRepository: IBookingRepository,
        private readonly configRepository: IConfigRepository
    ) {}

    async handle(): Promise<OutboundBooking[]> {
        const pricing = await loadPricing(this.configRepository);
        const bookings = await this.bookingRepository.getOutboundBookings();

        return bookings.map((booking) => {
            const overdueDays = countOverdueDays(booking.endDate);

            return {
                booking,
                overdueDays,
                overstayFee: calculateOverstayFee(
                    overdueDays,
                    booking.bookingShelfs.map((bookingShelf) => ({
                        type: bookingShelf.shelf.type,
                        assignedPallets: bookingShelf.assignedPallets,
                    })),
                    pricing
                ),
            };
        });
    }
}
