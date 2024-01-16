import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type StockDocument = HydratedDocument<Stock>;

@Schema({ timestamps: true })
export class Stock {
    @Prop({ required: true, unique: true })
    code: string; // 종목코드

    @Prop({ required: true })
    name: string; // 종목명

    @Prop({ default: 0 })
    price: number; // 현재가

    @Prop({ default: 0 })
    marketCap: number; // 시가총액

    @Prop({ default: 0 })
    tradeAmount: number; // 거래 대금

    @Prop({ default: 0 })
    tradeVolume: number; // 거래량

    @Prop({ default: 0 })
    priorTradeVolume: number; // 전일 거래량

    @Prop({ default: 0 })
    per: number; // PER
}

export const StockSchema = SchemaFactory.createForClass(Stock);
