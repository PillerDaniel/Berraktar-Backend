import type { ShelfType } from '../enums/ShelfType.js';
import type Booking from '../models/Booking.js';
import type Invoice from '../models/Invoice.js';
import type { PricingConfig } from '../services/InvoiceCalculator.js';
import type {
    ShelfAvailability,
    WarehouseSummary,
} from '../services/ShelfAllocator.js';

export interface AvailabilityFilter {
    startDate: string;
    endDate: string;
    type: ShelfType;
    // null = any active warehouse
    warehouseId: string | null;
}

export interface CreatePaidBookingInput extends AvailabilityFilter {
    userId: string;
    pallets: number;
    pricing: PricingConfig;
}

export interface PaidBookingResult {
    booking: Booking;
    invoice: Invoice;
    warehouse: WarehouseSummary;
    balance: number;
}

export interface IBookingRepository {
    getShelfAvailability(
        filter: AvailabilityFilter
    ): Promise<ShelfAvailability[]>;
    /**
     * Allocates shelves, charges the user's wallet and stores the booking with
     * its paid invoice in one transaction. Throws an AppError when there is no
     * free capacity (409) or the wallet balance is too low (402).
     */
    createPaidBooking(
        input: CreatePaidBookingInput
    ): Promise<PaidBookingResult>;
    getBookingsByUserId(userId: string): Promise<Booking[]>;
}
