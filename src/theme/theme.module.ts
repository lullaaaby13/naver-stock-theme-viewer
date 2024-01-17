import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThemeSchema } from './theme.schema';
import ThemeService from './theme.service';
import ThemeController from './theme.controller';

@Module({
    imports: [MongooseModule.forFeature([{ name: 'Theme', schema: ThemeSchema }])],
    controllers: [ThemeController],
    providers: [ThemeService],
    exports: [ThemeService],
})
export default class ThemeModule {}
