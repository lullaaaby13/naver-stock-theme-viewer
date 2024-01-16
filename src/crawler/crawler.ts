import { Browser } from 'puppeteer';

export default abstract class Crawler {
    protected readonly baseURL: string = '';
    protected onProcess: boolean;
    protected browser: Browser;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
        this.onProcess = false;
    }

    public async run(args?: any[]) {
        if (this.onProcess) {
            return;
        }
        try {
            this.onProcess = true;
            await this.execute(args);
        } catch (error) {
            console.error(error);
        } finally {
            await this.terminate();
            this.onProcess = false;
        }
    }

    protected abstract execute(args?: any[]): Promise<void>;
    public async terminate() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}
