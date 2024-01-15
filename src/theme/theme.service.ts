import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Theme } from './theme.schema';
import { Model } from 'mongoose';

@Injectable()
export default class ThemeService {
    constructor(@InjectModel(Theme.name) private themeModel: Model<Theme>) {}

    async getThemes(): Promise<Theme[]> {
        return this.themeModel.find().exec();
    }

    async create(theme: Theme): Promise<Theme> {
        const themeDocument = new this.themeModel(theme);
        return themeDocument.save();
    }
}
