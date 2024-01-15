import { Injectable } from '@nestjs/common';
import { Browser, launch, Page } from 'puppeteer';
import { TabPool } from '../utils/extentions/puppeteer/tab';
import { delay } from '../utils/common.util';
import { substringAfter } from '../utils/extentions/common/string-utils';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export default class CollectAllThemesCrawler {
    private readonly DEFAULT_URL = 'https://finance.naver.com';
    private onProcessCollectAllThemes: boolean = false;
    private browser: Browser;

    constructor(private eventEmitter: EventEmitter2) {
    }

    async collectAllThemes() {
        if (this.onProcessCollectAllThemes) {
            return;
        }
        try {
            this.onProcessCollectAllThemes = true;
            this.browser = await launch({ headless: false, defaultViewport: { width: 1920, height: 1080 } });
            const page = await this.browser.newPage();
            const tabPool = new TabPool(this.browser, 10, 1000 * 10);

            await page.goAndWaitNavigation(`${this.DEFAULT_URL}/sise/theme.naver`);
            const lastPageLink = await page.$('table.Nnavi td.pgRR a').then(lastPageButton => lastPageButton.href());
            const lastPageNumber = substringAfter(lastPageLink, 'page=');
            const themeUrls = Array.from({ length: Number(lastPageNumber) }, (_, i) => i + 1).map(
                pageNumber => `https://finance.naver.com/sise/theme.naver?&page=${pageNumber}`,
            );

            const tabTaskResults = await tabPool.run(themeUrls, async tab => {
                await delay(1000);
                const links = await tab.$$('table.type_1.theme td.col_type1 a');
                return {
                    success: true,
                    result: await Promise.all(links.map(async link => link.href())),
                };
            });

            const initializedTab = {};

            await tabPool.run(
                tabTaskResults.flatMap(it => it.result).map(link => `${this.DEFAULT_URL}${link}`),
                async (tab: Page, id: string) => {

                    if (!initializedTab[id]) {
                        console.log('not initialized');
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

                        await Promise.all([
                            tab.click2('div.item_btn a'),
                            tab.waitForNavigation(),
                        ]);
                        initializedTab[id] = true;
                    } else {
                        console.log('already initialized');
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
        } catch (error) {
            console.error(error);
        } finally {
            await this.terminate();
            this.onProcessCollectAllThemes = false;
        }
    }

    async terminate() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}
