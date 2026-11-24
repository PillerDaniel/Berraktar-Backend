import { ShelfType } from '../enums/ShelfType.js';

export interface PricingConfig {
    unitPrice: number;
    refrigeratedMultiplier: number;
    overstayMultiplier: number;
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

const rawAmount = (
    days: number,
    allocations: PricedAllocation[],
    config: PricingConfig
): number =>
    allocations.reduce(
        (total, allocation) =>
            total +
            allocation.assignedPallets *
                pricePerPalletPerDay(allocation.type, config) *
                days,
        0
    );

/** Total = sum over shelves of pallets * daily pallet price * days, in whole HUF. */
export const calculateInvoiceAmount = (
    days: number,
    allocations: PricedAllocation[],
    config: PricingConfig
): number => Math.round(rawAmount(days, allocations, config));

/**
 * Fee for the days the goods stayed after the end date: the normal daily
 * price raised by the overstay multiplier, in whole HUF.
 */
export const calculateOverstayFee = (
    overdueDays: number,
    allocations: PricedAllocation[],
    config: PricingConfig
): number =>
    overdueDays > 0
        ? Math.round(
              rawAmount(overdueDays, allocations, config) *
                  config.overstayMultiplier
          )
        : 0;
