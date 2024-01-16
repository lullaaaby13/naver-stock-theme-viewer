import CollectedEventHandler from './collected-event.handler';
import { Test } from '@nestjs/testing';
import { EventEmitterModule } from '@nestjs/event-emitter';
import ThemeService from '../theme/theme.service';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import StockService from '../stock/stock.service';

describe('CollectedEventHandler', () => {
    let handler;

    beforeEach(async () => {
        const app = await Test.createTestingModule({
            imports: [EventEmitterModule.forRoot()],
            providers: [
                CollectedEventHandler,
                {
                    provide: ThemeService,
                    useValue: {
                        save: jest.fn(),
                    },
                },
                {
                    provide: StockService,
                    useValue: {
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        handler = app.get(CollectedEventHandler);
    });

    it('should be defined', () => {
        expect(handler).toBeDefined();
    });

    it('handleThemCollectedEvent', () => {
        const html = readFileSync(resolve(__dirname, 'data', 'theme-detail.html'), 'utf8');
        handler.handleThemCollectedEvent({
            code: '176',
            url: 'https://finance.naver.com/sise/sise_group_detail.naver?type=theme&no=176',
            html: html,
        });
    });

    it('handleStockCollectedEvent', () => {
        const html = readFileSync(resolve(__dirname, 'data', 'stock.html'), 'utf8');
        handler.handleStockCollectedEvent({
            code: '323410', // 카카오뱅크
            url: 'https://finance.naver.com/item/main.naver?code=005930',
            html: html,
        });
    });
});
