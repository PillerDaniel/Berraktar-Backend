import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';

import { BookingStatus } from '../enums/BookingStatus.js';
import User from './User.js';
import BookingShelf from './BookingShelf.js';
import Invoice from './Invoice.js';

@Entity('bookings')
export default class Booking {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: Relation<User>;

    // 'YYYY-MM-DD'; the end date is the day the goods leave, so it is not billed
    @Column({ type: 'date' })
    startDate!: string;

    @Column({ type: 'date' })
    endDate!: string;

    @Column({ type: 'int' })
    totalPallets!: number;

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING,
    })
    status!: BookingStatus;

    // set when the goods leave the warehouse and the booking is closed
    @Column({ type: 'timestamp', nullable: true })
    releasedAt!: Date | null;

    @OneToMany(() => BookingShelf, (bookingShelf) => bookingShelf.booking)
    bookingShelfs!: Relation<BookingShelf[]>;

    @OneToMany(() => Invoice, (invoice) => invoice.booking)
    invoices!: Relation<Invoice[]>;
}
