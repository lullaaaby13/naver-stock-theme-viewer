import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ThemeDocument = HydratedDocument<Theme>;

@Schema({ timestamps: true })
export class Theme {
    @Prop({ required: true, unique: true })
    code: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    stockCount: number;

    @Prop({ required: true })
    averageMarketCapPerStock: number;

    @Prop({ required: true })
    averageTradingValuePerStock: number;

    @Prop({ required: true })
    averageTradingVolumePerStock: number;

    constructor(
        code: string,
        name: string,
        stockCount: number,
        averageMarketCapPerStock: number,
        averageTradingValuePerStock: number,
        averageTradingVolumePerStock: number,
    ) {
        this.code = code;
        this.name = name;
        this.stockCount = stockCount;
        this.averageMarketCapPerStock = averageMarketCapPerStock;
        this.averageTradingValuePerStock = averageTradingValuePerStock;
        this.averageTradingVolumePerStock = averageTradingVolumePerStock;
    }
}

export const ThemeSchema = SchemaFactory.createForClass(Theme);
