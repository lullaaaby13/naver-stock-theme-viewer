import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Stock } from './stock.schema';
import { Model } from 'mongoose';
import { CreateUpdateStockRequest } from './model';

@Injectable()
export default class StockService {
    private readonly logger = new Logger(StockService.name);
    constructor(@InjectModel(Stock.name) private stockModel: Model<Stock>) {}

    async list(): Promise<Stock[]> {
        return this.stockModel.find().exec();
    }

    async save(request: CreateUpdateStockRequest): Promise<Stock> {
        try {
            const document = await this.stockModel.findOneAndUpdate({ code: request.code }, request, { upsert: true }).exec();
            this.logger.log(`주식 생성 & 업데이트 성공 [코드 = ${request.code}]`);
            return document;
        } catch (error) {
            this.logger.error(`주식 생성 & 업데이트 실패 [코드 = ${request.code}]`, error.stack);
            throw error;
        }
    }
}
