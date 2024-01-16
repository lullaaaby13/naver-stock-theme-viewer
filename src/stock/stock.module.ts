import { Module } from '@nestjs/common';
import StockController from './stock.controller';
import StockService from './stock.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StockSchema } from './stock.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Stock', schema: StockSchema }])],
    controllers: [StockController],
    providers: [StockService],
    exports: [StockService],
})
export default class StockModule {}
