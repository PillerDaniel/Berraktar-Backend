import type { ShelfType } from '../enums/ShelfType.js';

export interface WarehouseSummary {
    id: string;
    country: string;
    city: string;
    address: string;
}

/** A bookable shelf with the pallet places still free in the requested period. */
export interface ShelfAvailability {
    shelfId: string;
    type: ShelfType;
    capacity: number;
    free: number;
    warehouse: WarehouseSummary;
}

export interface ShelfAllocation {
    shelfId: string;
    type: ShelfType;
    assignedPallets: number;
}

export interface AllocationResult {
    warehouse: WarehouseSummary;
    shelves: ShelfAllocation[];
}

/**
 * Places the pallets on the shelves of a single warehouse: the first warehouse
 * (in input order) with enough free places wins, and its emptiest shelves are
 * filled first so the booking touches as few shelves as possible.
 * Returns null when no warehouse can hold the whole booking.
 */
export const allocatePallets = (
    shelves: ShelfAvailability[],
    pallets: number
): AllocationResult | null => {
    const byWarehouse = new Map<string, ShelfAvailability[]>();

    for (const shelf of shelves) {
        if (shelf.free <= 0) continue;
        const group = byWarehouse.get(shelf.warehouse.id) ?? [];
        group.push(shelf);
        byWarehouse.set(shelf.warehouse.id, group);
    }

    for (const group of byWarehouse.values()) {
        const first = group[0];
        const totalFree = group.reduce((sum, shelf) => sum + shelf.free, 0);
        if (!first || totalFree < pallets) continue;

        const allocations: ShelfAllocation[] = [];
        let remaining = pallets;

        for (const shelf of [...group].sort((a, b) => b.free - a.free)) {
            if (remaining === 0) break;
            const assignedPallets = Math.min(shelf.free, remaining);
            allocations.push({
                shelfId: shelf.shelfId,
                type: shelf.type,
                assignedPallets,
            });
            remaining -= assignedPallets;
        }

        return { warehouse: first.warehouse, shelves: allocations };
    }

    return null;
};
