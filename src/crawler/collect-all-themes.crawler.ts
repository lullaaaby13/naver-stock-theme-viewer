import { Injectable } from '@nestjs/common';
import { launch, Page } from 'puppeteer';
import { TabPool } from '../utils/extentions/puppeteer/tab';
import { substringAfter } from '../utils/extentions/common/string-utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Crawler from './crawler';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class CollectAllThemesCrawler extends Crawler {
    private readonly NUMBER_OF_TABS;
    private readonly headless = process.env.NODE_ENV === 'production';
    constructor(
        private configService: ConfigService,
        private eventEmitter: EventEmitter2,
    ) {
        super('https://finance.naver.com');
        this.NUMBER_OF_TABS = this.configService.get<number>('COLLECT_ALL_THEMES_CRAWLER_TAB');
    }

    async execute() {
        this.browser = await launch({ headless: this.headless, defaultViewport: { width: 1920, height: 1080 } });
        const page = await this.browser.newPage();
        const tabPool = new TabPool(this.browser, this.NUMBER_OF_TABS, 1000 * 10);

        await page.goAndWaitNavigation(`${this.baseURL}/sise/theme.naver`);
        const lastPageLink = await page.$('table.Nnavi td.pgRR a').then(lastPageButton => lastPageButton.href());
        const lastPageNumber = substringAfter(lastPageLink, 'page=');
        const themeUrls = Array.from({ length: Number(lastPageNumber) }, (_, i) => i + 1).map(
            pageNumber => `${this.baseURL}/sise/theme.naver?&page=${pageNumber}`,
        );

        const tabTaskResults = await tabPool.run(themeUrls, async tab => {
            await tab.waitForSelector('table.type_1.theme td.col_type1 a');
            const links = await tab.$$('table.type_1.theme td.col_type1 a');
            return {
                success: true,
                result: await Promise.all(links.map(async link => link.href())),
            };
        });

        const initializedTab = {};

        await tabPool.run(
            tabTaskResults.flatMap(it => it.result).map(link => `${this.baseURL}${link}`),
            async (tab: Page, id: string) => {
                if (!initializedTab[id]) {
                    await Promise.all(
                        Array.from({ length: 27 }, (_, i) => i + 1)
                            .map(optionNumber => `#option${optionNumber}`)
                            .map(optionSelector => tab.checkbox(optionSelector, false)),
                    );

                    await Promise.all([
                        tab.checkbox('#option1', true),
                        tab.checkbox('#option3', true),
                        tab.checkbox('#option4', true),
                        tab.checkbox('#option9', true),
                        tab.checkbox('#option15', true),
                    ]);

                    await Promise.all([tab.click2('div.item_btn a'), tab.waitForNavigation()]);
                    initializedTab[id] = true;
                }

                const html = await tab.outerHTML('body');
                this.eventEmitter.emit('theme.collected', {
                    code: substringAfter(tab.url(), 'no='),
                    url: tab.url(),
                    html: html,
                });

                return { success: true, result: true };
            },
        );
    }
}
