import type { ShelfType } from '../../../domain/enums/ShelfType.js';
import type { IBookingRepository } from '../../../domain/iRepositories/IBookingRepository.js';
import type { IConfigRepository } from '../../../domain/iRepositories/IConfigRepository.js';
import { AppError } from '../../../domain/errors/AppError.js';
import {
    assertValidBookingPeriod,
    countBookingDays,
} from '../../../domain/services/BookingPeriod.js';
import {
    calculateInvoiceAmount,
    pricePerPalletPerDay,
} from '../../../domain/services/InvoiceCalculator.js';
import { allocatePallets } from '../../../domain/services/ShelfAllocator.js';
import type {
    ShelfAllocation,
    WarehouseSummary,
} from '../../../domain/services/ShelfAllocator.js';
import loadPricing from '../../utils/LoadPricing.js';
import { GetBookingQuoteQuery } from './GetBookingQuoteQuery.js';

export interface BookingQuote {
    startDate: string;
    endDate: string;
    days: number;
    pallets: number;
    type: ShelfType;
    pricePerPalletPerDay: number;
    totalAmount: number;
    warehouse: WarehouseSummary;
    shelves: ShelfAllocation[];
}

export class GetBookingQuoteQueryHandler {
    constructor(
        private readonly bookingRepository: IBookingRepository,
        private readonly configRepository: IConfigRepository
    ) {}

    async handle(query: GetBookingQuoteQuery): Promise<BookingQuote> {
        assertValidBookingPeriod(query.startDate, query.endDate);

        const pricing = await loadPricing(this.configRepository);

        const shelves = await this.bookingRepository.getShelfAvailability({
            startDate: query.startDate,
            endDate: query.endDate,
            type: query.type,
            warehouseId: query.warehouseId,
        });

        const allocation = allocatePallets(shelves, query.pallets);

        if (!allocation) {
            throw new AppError(
                409,
                'There is no free warehouse capacity for the given period.',
                'A megadott időszakra nincs elegendő szabad raktárterület.'
            );
        }

        const days = countBookingDays(query.startDate, query.endDate);

        return {
            startDate: query.startDate,
            endDate: query.endDate,
            days,
            pallets: query.pallets,
            type: query.type,
            pricePerPalletPerDay: pricePerPalletPerDay(query.type, pricing),
            totalAmount: calculateInvoiceAmount(
                days,
                allocation.shelves,
                pricing
            ),
            warehouse: allocation.warehouse,
            shelves: allocation.shelves,
        };
    }
}
