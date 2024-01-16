import { Module } from '@nestjs/common';
import ThemeModule from '../theme/theme.module';
import CollectedEventHandler from './collected-event.handler';
import StockModule from '../stock/stock.module';

@Module({
    imports: [ThemeModule, StockModule],
    providers: [CollectedEventHandler],
})
export default class EventModule {}
