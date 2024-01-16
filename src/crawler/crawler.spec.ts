import { Test } from '@nestjs/testing';
import CollectAllThemesCrawler from './collect-all-themes.crawler';
import '../utils/extentions/puppeteer/index';
import { EventEmitterModule } from '@nestjs/event-emitter';
import CollectStocksCrawler from './collect-stocks.crawler';

describe('Crawler', () => {
    describe('CollectAllThemesCrawler', () => {
        let collectAllThemesCrawler: CollectAllThemesCrawler;

        beforeEach(async () => {
            const app = await Test.createTestingModule({
                imports: [EventEmitterModule.forRoot()],
                providers: [CollectAllThemesCrawler],
            }).compile();

            collectAllThemesCrawler = app.get(CollectAllThemesCrawler);
        });

        it('should be defined', () => {
            expect(collectAllThemesCrawler).toBeDefined();
        });

        it(
            'collectAllThemesAndStocks',
            async () => {
                await collectAllThemesCrawler.run();
            },
            1000 * 60 * 60,
        );
    });

    describe('CollectStocksCrawler', () => {
        let collectStocksCrawler: CollectStocksCrawler;

        beforeEach(async () => {
            const app = await Test.createTestingModule({
                imports: [EventEmitterModule.forRoot()],
                providers: [CollectStocksCrawler],
            }).compile();

            collectStocksCrawler = app.get(CollectStocksCrawler);
        });

        it('should be defined', () => {
            expect(collectStocksCrawler).toBeDefined();
        });

        it(
            'collectStocks',
            async () => {
                await collectStocksCrawler.run(['117580', '114090', '114100', '114120', '114140', '114160', '114170', '114190']);
            },
            1000 * 60 * 60,
        );
    });
});
