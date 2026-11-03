import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';

import User from './User.js';

@Entity('wallets')
export default class Wallet {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({
        type: 'decimal',
        precision: 18,
        scale: 2,
        default: 0,
    })
    balance!: number;

    @OneToOne(() => User, (user) => user.wallet)
    @JoinColumn()
    user!: Relation<User>;
}
