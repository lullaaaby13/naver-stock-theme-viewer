import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Crawler from './crawler';
import { TabPool } from '../utils/extentions/puppeteer/tab';
import { substringAfter } from '../utils/extentions/common/string-utils';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class CollectStocksCrawler extends Crawler {
    private readonly NUMBER_OF_TABS;
    private readonly headless;
    constructor(
        private configService: ConfigService,
        private eventEmitter: EventEmitter2,
    ) {
        super('https://finance.naver.com');
        this.NUMBER_OF_TABS = this.configService.get<number>('COLLECT_STOCKS_CRAWLER_TAB');
        const headless = this.configService.get<string>('HEADLESS');
        this.headless = headless === 'true' || headless === 'new' ? 'new' : false;
    }

    async execute(stockCodes: string[]): Promise<void> {
        await this.launch(this.headless);
        const tabPool = new TabPool(this.browser, this.NUMBER_OF_TABS, 1000 * 10);

        const urls = stockCodes.map(stockCode => `${this.baseURL}/item/main.naver?code=${stockCode}`);

        await tabPool.run(urls, async tab => {
            const html = await tab.outerHTML('body');
            this.eventEmitter.emit('stock.collected', {
                code: substringAfter(tab.url(), 'code='),
                url: tab.url(),
                html: html,
            });

            return {
                success: true,
                result: html,
            };
        });
    }
}
