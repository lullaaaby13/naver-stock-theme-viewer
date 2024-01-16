import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Crawler from './crawler';
import { Promise } from 'mongoose';
import { launch } from 'puppeteer';
import { TabPool } from '../utils/extentions/puppeteer/tab';
import { delay } from '../utils/common.util';
import { substringAfter } from '../utils/extentions/common/string-utils';

@Injectable()
export default class CollectStocksCrawler extends Crawler {
    private readonly NUMBER_OF_TABS = 20;
    constructor(private eventEmitter: EventEmitter2) {
        super('https://finance.naver.com');
    }

    async execute(stockCodes: string[]): Promise<void> {
        this.browser = await launch({ headless: false, defaultViewport: { width: 1920, height: 1080 } });
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
