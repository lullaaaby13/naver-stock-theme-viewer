import CollectedEventHandler from './collected-event.handler';
import { Test } from '@nestjs/testing';
import { EventEmitterModule } from '@nestjs/event-emitter';
import ThemeService from '../theme/theme.service';
import { readFileSync } from 'fs';
import { resolve } from 'path';

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
                        create: jest.fn(),
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
});
