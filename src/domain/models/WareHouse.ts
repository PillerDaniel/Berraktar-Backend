import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';

import Shelf from './Shelf.js';

@Entity('warehouses')
export default class WareHouse {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    country!: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    city!: string;

    @Column({
        type: 'varchar',
        length: 255,
    })
    address!: string;

    @Column({ type: 'boolean', default: true })
    active!: boolean;

    @OneToMany(() => Shelf, (shelf) => shelf.warehouse)
    shelfs!: Relation<Shelf[]>;
}
