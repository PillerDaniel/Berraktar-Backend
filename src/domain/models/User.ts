import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';

import { UserRole } from '../enums/UserRole.js';
import Wallet from './Wallet.js';
import Profile from './Profile.js';

@Entity('users')
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar' })
    firstName!: string;

    @Column({ type: 'varchar' })
    lastName!: string;

    @Column({
        type: 'varchar',
        unique: true,
    })
    email!: string;

    @Column({ type: 'varchar' })
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role!: UserRole;

    @Column({
        type: 'boolean',
        default: true,
    })
    active!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @OneToOne(() => Wallet, (wallet) => wallet.user)
    wallet!: Relation<Wallet>;

    @OneToOne(() => Profile, (profile) => profile.user)
    profile!: Relation<Profile>;
}
