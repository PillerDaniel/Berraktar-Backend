import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';

import Booking from './Booking.js';
import Shelf from './Shelf.js';

@Entity('booking_shelfs')
export default class BookingShelf {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    bookingId!: string;

    @ManyToOne(() => Booking, (booking) => booking.bookingShelfs, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'bookingId' })
    booking!: Relation<Booking>;

    @Column({ type: 'uuid' })
    shelfId!: string;

    @ManyToOne(() => Shelf, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'shelfId' })
    shelf!: Relation<Shelf>;

    @Column({ type: 'int' })
    assignedPallets!: number;
}
