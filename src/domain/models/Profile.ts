import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';

import User from './User.js';

@Entity('profiles')
export default class Profile {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    country?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    city?: string;

    @Column({ type: 'varchar', length: 120, nullable: true })
    address?: string;

    @Column({ type: 'int', nullable: true })
    postalCode?: number;

    @Column({ type: 'varchar', length: 30, nullable: true })
    bankAccountNumber?: string;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    user!: Relation<User>;
}
