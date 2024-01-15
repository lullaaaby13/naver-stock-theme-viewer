import { Module } from '@nestjs/common';
import CollectAllThemesCrawler from './collect-all-themes.crawler';
import CrawlerController from './crawler.controller';

@Module({
    controllers: [CrawlerController],
    providers: [CollectAllThemesCrawler],
})
export default class CrawlerModule {}
