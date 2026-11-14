import { ShelfType } from '../enums/ShelfType.js';

export interface PricingConfig {
    unitPrice: number;
    refrigeratedMultiplier: number;
}

export interface PricedAllocation {
    type: ShelfType;
    assignedPallets: number;
}

/** Daily price of one pallet on a shelf of the given type. */
export const pricePerPalletPerDay = (
    type: ShelfType,
    config: PricingConfig
): number =>
    type === ShelfType.REFRIGERATED
        ? config.unitPrice * config.refrigeratedMultiplier
        : config.unitPrice;

/** Total = sum over shelves of pallets * daily pallet price * days, in whole HUF. */
export const calculateInvoiceAmount = (
    days: number,
    allocations: PricedAllocation[],
    config: PricingConfig
): number => {
    let total = 0;

    for (const allocation of allocations) {
        total +=
            allocation.assignedPallets *
            pricePerPalletPerDay(allocation.type, config) *
            days;
    }

    return Math.round(total);
};
