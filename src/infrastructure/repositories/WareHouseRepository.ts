import type { IWareHouseRepository } from '../../domain/iRepositories/IWareHouseRepository.js';
import WareHouse from '../../domain/models/WareHouse.js';
import Shelf from '../../domain/models/Shelf.js';
import dataSource from '../db/DataSource.js';

export default class WareHouseRepository implements IWareHouseRepository {
    private repo = dataSource.getRepository(WareHouse);
    private shelfRepository = dataSource.getRepository(Shelf);

    async createWareHouse(warehouse: WareHouse): Promise<WareHouse> {
        return await this.repo.save(warehouse);
    }

    async getAllWareHouses(): Promise<WareHouse[]> {
        return await this.repo.find();
    }

    async getWareHouseById(warehouseId: string): Promise<WareHouse | null> {
        return await this.repo.findOne({
            where: { id: warehouseId },
            relations: {
                shelfs: true,
            },
        });
    }

    async editWareHouseById(
        warehouseId: string,
        warehouse: Partial<WareHouse>
    ): Promise<WareHouse | null> {
        const existingWarehouse = await this.repo.findOneBy({
            id: warehouseId,
        });

        if (!existingWarehouse) {
            return null;
        }

        const updatedWarehouse = this.repo.merge(existingWarehouse, warehouse);
        return await this.repo.save(updatedWarehouse);
    }

    async CheckAvailability(
        warehouseId: string,
        startDate: Date,
        endDate: Date,
        type: 'none' | 'refrigerated',
        palletCount: number
    ): Promise<boolean> {
        if (palletCount <= 0) {
            return false;
        }

        const warehouse = await this.repo.findOneBy({ id: warehouseId });
        if (!warehouse || !warehouse.active || warehouse.overstay) {
            return false;
        }

        const formattedStart = new Date(startDate).toISOString().split('T')[0];
        const formattedEnd = new Date(endDate).toISOString().split('T')[0];

        const shelves = await this.shelfRepository
            .createQueryBuilder('shelf')
            .leftJoinAndSelect('shelf.bookingShelfs', 'bookingShelf')
            .leftJoinAndSelect(
                'bookingShelf.booking',
                'booking',
                'booking.startDate < :endDate AND booking.endDate > :startDate AND booking.status != :cancelledStatus',
                {
                    startDate: formattedStart,
                    endDate: formattedEnd,
                    cancelledStatus: 'cancelled',
                }
            )
            .where('shelf.warehouseId = :warehouseId', { warehouseId })
            .andWhere('shelf.type = :type', { type })
            .andWhere('shelf.status = :activeStatus', {
                activeStatus: 'active',
            })
            .getMany();

        if (!shelves.length) {
            return false;
        }

        let totalCapacity = 0;
        let bookedPallets = 0;

        for (const shelf of shelves) {
            totalCapacity += shelf.capacity;

            if (shelf.bookingShelfs) {
                for (const bs of shelf.bookingShelfs) {
                    if (bs.booking) {
                        bookedPallets += bs.assignedPallets;
                    }
                }
            }
        }

        return totalCapacity - bookedPallets >= palletCount;
    }
}
