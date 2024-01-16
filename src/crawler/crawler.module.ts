import { Module } from '@nestjs/common';
import CollectAllThemesCrawler from './collect-all-themes.crawler';
import CrawlerController from './crawler.controller';
import CollectStocksCrawler from './collect-stocks.crawler';
import StockModule from '../stock/stock.module';

@Module({
    imports: [StockModule],
    controllers: [CrawlerController],
    providers: [CollectAllThemesCrawler, CollectStocksCrawler],
})
export default class CrawlerModule {}
