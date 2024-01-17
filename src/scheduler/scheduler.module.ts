import { Module } from '@nestjs/common';
import CollectScheduler from './collect.scheduler';
import CrawlerModule from '../crawler/crawler.module';
import StockModule from '../stock/stock.module';

@Module({
    imports: [CrawlerModule, StockModule],
    providers: [CollectScheduler],
})
export default class SchedulerModule {}
