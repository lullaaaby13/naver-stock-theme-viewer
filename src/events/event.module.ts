import { Module } from '@nestjs/common';
import ThemeModule from '../theme/theme.module';
import CollectedEventHandler from './collected-event.handler';
import StockModule from '../stock/stock.module';
import OnErrorEventHandler from './on-error.handler';

@Module({
    imports: [ThemeModule, StockModule],
    providers: [CollectedEventHandler, OnErrorEventHandler],
})
export default class EventModule {}
