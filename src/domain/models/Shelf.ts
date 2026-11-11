import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';
import { ShelfType } from '../enums/ShelfType.js';
import { ShelfStatus } from '../enums/ShelfStatus.js';
import WareHouse from './WareHouse.js';

@Entity('shelfs')
export default class Shelf {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'int' })
    capacity!: number;

    @Column({
        type: 'enum',
        enum: ShelfType,
        default: ShelfType.NONE,
    })
    type!: ShelfType;

    @Column({
        type: 'enum',
        enum: ShelfStatus,
        default: ShelfStatus.UNUSED,
    })
    status!: ShelfStatus;

    @Column({ type: 'uuid' })
    warehouseId!: string;

    @ManyToOne(() => WareHouse, (warehouse) => warehouse.shelfs, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'warehouseId' })
    warehouse!: Relation<WareHouse>;
}
