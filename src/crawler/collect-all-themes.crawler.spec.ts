import { Test } from '@nestjs/testing';
import CollectAllThemesCrawler from './collect-all-themes.crawler';
import '../utils/extentions/puppeteer/index';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('CrawlerService', () => {
    let service: CollectAllThemesCrawler;

    beforeEach(async () => {
        const app = await Test.createTestingModule({
            imports: [EventEmitterModule.forRoot()],
            providers: [CollectAllThemesCrawler],
        }).compile();

        service = app.get(CollectAllThemesCrawler);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it(
        'collectAllThemesAndStocks',
        async () => {
            await service.collectAllThemes();
        },
        1000 * 60 * 60,
    );
});
