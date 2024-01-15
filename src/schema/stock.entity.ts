import { BaseEntity } from './base.entity';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class StockEntity extends BaseEntity {
    @PrimaryColumn()
    code: string;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    tradeValue: number;

    @Column()
    tradeVolume: number;

    @Column()
    per: number;

    @Column()
    pbr: number;
}
