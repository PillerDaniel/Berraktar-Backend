import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('config')
export default class Config {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'int' })
    unitPrice!: number;

    @Column({
        type: 'decimal',
        precision: 18,
        scale: 2,
        default: 0,
    })
    refrigeratedMultiplier!: number;

    // the daily price of the days after the end date is multiplied by this
    @Column({
        type: 'decimal',
        precision: 18,
        scale: 2,
        default: 1.5,
    })
    overstayMultiplier!: number;
}
