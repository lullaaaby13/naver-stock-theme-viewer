import { Browser, Page } from 'puppeteer';
import { v4 as uuid } from 'uuid';
import { delay } from '../../common.util';
import { timeout } from 'promise-timeout';

export interface TabTaskResult {
    success: boolean;
    result?: any;
    error?: Error;
}
export type TabTask = (page: Page, id: string) => Promise<TabTaskResult>;

export class Tab {
    public id: string;
    private page: Page;
    private taskTimout: number;

    constructor(page: Page, taskTimout: number) {
        this.id = uuid();
        this.page = page;
        this.taskTimout = taskTimout;
    }

    async run(link: string, task: TabTask): Promise<TabTaskResult> {
        try {
            await Promise.all([this.page.goto(link), this.page.waitForNavigation()]);
            return await timeout(task(this.page, this.id), this.taskTimout);
        } catch (e) {
            await this.refreshPage();
            return { success: false, error: e };
        }
    }

    private async refreshPage() {
        const browser = this.page.browser();
        await this.page.close();
        this.page = await browser.newPage();
    }
}

export class TabPool {
    private tabs: Tab[];
    private fetchTabTimeout: number = 1000 * 30;

    public constructor(browser: Browser, numberOfTabs: number, taskTimout: number = 1000 * 30) {
        this.tabs = [];
        for (let i = 0; i < numberOfTabs; i++) {
            browser.newPage().then(page => {
                const tab = new Tab(page, taskTimout);
                this.tabs.push(tab);
            });
        }
    }

    public async run(links: string[], task: TabTask): Promise<TabTaskResult[]> {
        return await Promise.all(
            links.map(async link => {
                const tab = await this.getTab();
                const tabTaskResult = await tab.run(link, task);
                this.tabs.push(tab);
                return tabTaskResult;
            }),
        );
    }

    private async getTab(): Promise<Tab> {
        // const start = Date.now();
        while (true) {
            const tab = this.tabs.pop();
            if (tab) {
                return tab;
            }
            // if (Date.now() - start > this.fetchTabTimeout) {
            //     throw new Error('탭을 가져올 수 없습니다.');
            // }
            await delay(500);
        }
    }
}
