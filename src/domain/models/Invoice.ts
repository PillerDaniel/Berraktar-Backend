import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';

import { InvoiceStatus } from '../enums/InvoiceStatus.js';
import Booking from './Booking.js';
import User from './User.js';

@Entity('invoices')
export default class Invoice {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'uuid' })
    bookingId!: string;

    @ManyToOne(() => Booking, (booking) => booking.invoices, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'bookingId' })
    booking!: Relation<Booking>;

    @Column({ type: 'uuid' })
    userId!: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user!: Relation<User>;

    @Column({ type: 'int' })
    amount!: number;

    @Column({
        type: 'enum',
        enum: InvoiceStatus,
        default: InvoiceStatus.PENDING,
    })
    status!: InvoiceStatus;

    // a fee for the days the goods stayed after the end date
    @Column({ type: 'boolean', default: false })
    overstay!: boolean;

    @CreateDateColumn()
    issuedAt!: Date;
}
