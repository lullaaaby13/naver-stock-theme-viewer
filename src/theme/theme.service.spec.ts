import { Test } from '@nestjs/testing';
import ThemeService from './theme.service';
import { getModelToken } from '@nestjs/mongoose';
import { Theme } from './theme.schema';

const mockThemeRepository = [];
const themeModel = {
    find: () => ({
        exec: () => mockThemeRepository,
    }),
    save: theme => mockThemeRepository.push(theme),
};

describe('ThemeService', () => {
    let service: ThemeService;

    beforeEach(async () => {
        const app = await Test.createTestingModule({
            providers: [
                ThemeService,
                {
                    provide: getModelToken(Theme.name),
                    useValue: themeModel,
                },
            ],
        }).compile();

        service = app.get<ThemeService>(ThemeService);
        mockThemeRepository.splice(0, mockThemeRepository.length);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return an array of themes', async () => {
        mockThemeRepository.push(new Theme('abcd', 'Test Theme', 10, 100, 1000, 10000));
        const themes = await service.list();
        expect(themes).toEqual([new Theme('abcd', 'Test Theme', 10, 100, 1000, 10000)]);
    });
});
