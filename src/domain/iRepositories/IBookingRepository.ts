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

export interface CancelBookingResult {
    booking: Booking;
    refundedAmount: number;
    balance: number;
}

export interface ExtensionQuote {
    extraDays: number;
    amount: number;
}

export interface ExtendBookingResult extends ExtensionQuote {
    booking: Booking;
    invoice: Invoice;
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
    /**
     * Cancels the user's not yet started, not yet stored booking, refunds its
     * paid invoices to the wallet and frees the shelves. Throws an AppError
     * when the booking is missing (404) or can no longer be cancelled (409).
     */
    cancelBooking(
        bookingId: string,
        userId: string
    ): Promise<CancelBookingResult>;
    /**
     * Price of moving the end date of the user's booking later. Throws an
     * AppError when the booking is missing (404), is not active (409), the new
     * date is not later (400) or its shelves are taken in the added days (409).
     */
    getExtensionQuote(
        bookingId: string,
        userId: string,
        newEndDate: string,
        pricing: PricingConfig
    ): Promise<ExtensionQuote>;
    /**
     * Extends the booking on its own shelves and charges the difference to the
     * wallet in one transaction. Same errors as the quote, plus 402 when the
     * balance is too low.
     */
    extendBooking(
        bookingId: string,
        userId: string,
        newEndDate: string,
        pricing: PricingConfig
    ): Promise<ExtendBookingResult>;
    /** Bookings waiting for delivery, with tenant, warehouse and shelves. */
    getInboundBookings(): Promise<Booking[]>;
    /**
     * Marks a booking waiting for delivery as stored and its shelves as in
     * use. Throws an AppError when it is missing (404) or not pending (409).
     */
    storeBooking(bookingId: string): Promise<Booking>;
}
