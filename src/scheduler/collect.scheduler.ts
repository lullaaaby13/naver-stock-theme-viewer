import { Injectable, Logger } from '@nestjs/common';
import CollectAllThemesCrawler from '../crawler/collect-all-themes.crawler';
import CollectStocksCrawler from '../crawler/collect-stocks.crawler';
import StockService from '../stock/stock.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export default class CollectScheduler {
    private readonly logger = new Logger(CollectScheduler.name);
    constructor(
        private readonly collectAllThemesCrawler: CollectAllThemesCrawler,
        private readonly collectStocksCrawler: CollectStocksCrawler,
        private readonly stockService: StockService,
    ) {}

    @Cron('0 1 9-15 * * *')
    async allThemes() {
        this.logger.log(`테마 수집 스케줄러 시작`);
        try {
            await this.collectAllThemesCrawler.execute();
            this.logger.log(`테마 수집 스케줄러 종료`);
        } catch (e) {
            this.logger.error(`테마 수집 스케줄러 에러`, e);
        }
    }

    @Cron('0 */15 9-15 * * *')
    async stocks() {
        this.logger.log(`주식 수집 스케줄러 시작`);
        try {
            const stocks = await this.stockService.list();
            await this.collectStocksCrawler.execute(stocks.map(it => it.code));
            this.logger.log(`주식 수집 스케줄러 종료`);
        } catch (e) {
            this.logger.error(`주식 수집 스케줄러 에러`, e);
        }
    }
}
