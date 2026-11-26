import type { IBookingRepository } from '../../../domain/iRepositories/IBookingRepository.js';
import { assertValidBookingPeriod } from '../../../domain/services/BookingPeriod.js';
import { allocatePallets } from '../../../domain/services/ShelfAllocator.js';
import CheckAvailabilityQuery from './CheckAvailabilityQuery.js';

export interface AvailabilityResult {
    available: boolean;
    // free pallet places in the warehouse for the whole period
    freePallets: number;
}

/**
 * Answers "would this booking fit into this warehouse?" with exactly the
 * logic a booking uses: same period rules, same free-place query and the
 * same shelf allocation.
 */
export default class CheckAvailabilityQueryHandler {
    constructor(private readonly bookingRepository: IBookingRepository) {}

    async handle(query: CheckAvailabilityQuery): Promise<AvailabilityResult> {
        assertValidBookingPeriod(query.startDate, query.endDate);

        const shelves = await this.bookingRepository.getShelfAvailability({
            startDate: query.startDate,
            endDate: query.endDate,
            type: query.type,
            warehouseId: query.warehouseId,
        });

        const freePallets = shelves.reduce(
            (sum, shelf) => sum + Math.max(0, shelf.free),
            0
        );

        return {
            available: allocatePallets(shelves, query.palletCount) !== null,
            freePallets,
        };
    }
}
