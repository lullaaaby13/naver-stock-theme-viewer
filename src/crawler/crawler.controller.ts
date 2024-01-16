import { Body, Controller, Logger, Post } from '@nestjs/common';
import CollectAllThemesCrawler from './collect-all-themes.crawler';
import { CollectStocksRequest } from './model';
import CollectStocksCrawler from './collect-stocks.crawler';
import StockService from '../stock/stock.service';

@Controller('crawlers')
export default class CrawlerController {
    private readonly logger = new Logger(CrawlerController.name);
    constructor(
        // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private collectAllThemesCrawler: CollectAllThemesCrawler,
        private collectStocksCrawler: CollectStocksCrawler,
        private stockService: StockService,
    ) {}
    @Post('collect-all-themes')
    async collectAllThemes() {
        this.collectAllThemesCrawler.run();
    }

    @Post('collect-stocks')
    async collectStocks(@Body() request: CollectStocksRequest) {
        const stocks = await this.stockService.list();
        this.collectStocksCrawler.run(stocks.map(stock => stock.code));
    }
}
