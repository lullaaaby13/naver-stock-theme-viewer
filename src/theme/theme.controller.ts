import { Controller, Get } from '@nestjs/common';
import ThemeService from './theme.service';

@Controller('themes')
export default class ThemeController {
    constructor(private readonly themeService: ThemeService) {}
    @Get()
    async getThemes() {
        return [];
    }
}
