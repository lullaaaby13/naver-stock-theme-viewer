import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Theme } from './theme.schema';
import { Model } from 'mongoose';
import { CreateUpdateThemeRequest } from './model';

@Injectable()
export default class ThemeService {
    private readonly logger = new Logger(ThemeService.name);

    constructor(@InjectModel(Theme.name) private themeModel: Model<Theme>) {}

    async list(): Promise<Theme[]> {
        return this.themeModel.find().exec();
    }

    async save(request: CreateUpdateThemeRequest): Promise<Theme> {
        try {
            const document = await this.themeModel.findOneAndUpdate({ code: request.code }, request, { upsert: true }).exec();
            this.logger.log(`테마 생성 & 업데이트 성공 [코드 = ${request.code}]`);
            return document;
        } catch (error) {
            this.logger.error(`테마 생성 & 업데이트 실패 [코드 = ${request.code}]`, error.stack);
            throw error;
        }
    }
}
