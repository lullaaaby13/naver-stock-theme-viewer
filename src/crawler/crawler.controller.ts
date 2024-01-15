import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import CollectAllThemesCrawler from './collect-all-themes.crawler';
import { CollectStocksRequest } from './model';

@Controller('crawlers')
export default class CrawlerController {
    private readonly logger = new Logger(CrawlerController.name);
    constructor(
        // @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private crawlerService: CollectAllThemesCrawler,
    ) {}
    @Post('collect-all-themes')
    async collectAllThemes() {
        this.crawlerService.collectAllThemes();
    }

    @Post('collect-stocks')
    async collectStocks(@Body() request: CollectStocksRequest) {
        this.logger.log('logger test', CrawlerController.name);
    }
}
