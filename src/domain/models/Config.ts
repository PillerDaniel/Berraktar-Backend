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
}
