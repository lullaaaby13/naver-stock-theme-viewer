import ThemeService from '../theme/theme.service';
import { Injectable, Logger } from '@nestjs/common';
import { ThemeCollectedEvent } from './model';
import { OnEvent } from '@nestjs/event-emitter';
import * as cheerio from 'cheerio';

@Injectable()
export default class CollectedEventHandler {
    private readonly logger = new Logger(CollectedEventHandler.name);
    constructor(private readonly themeService: ThemeService) {}

    @OnEvent('theme.collected', { async: true })
    async handleThemCollectedEvent(payload: ThemeCollectedEvent) {
        this.logger.log(`테마 수집 [코드 = ${payload.code}, 주소 = ${payload.url}]`);

        const $ = cheerio.load(payload.html);
        const themeName = $('table.type_1 strong.info_title').text().trim();
        const stockRows = $('table.type_5 tr div.name_area').parent().parent();

        const stocks = [];
        const parseNumber = (element: cheerio.Element, index: number) => {
            let value = $(element).children('td').eq(index).text().trim().replace(/,/g, '');
            let number = Number(value);
            if (isNaN(number)) {
                throw new Error(`숫자 파싱 에러 [${value}`);
            }
            return number;
        }

        $(stockRows).each((index, element) => {
            const stockLink = $(element).children('td').eq(0).find('a');
            const stockCode = stockLink.attr('href').split('=')[1];
            const stockName = stockLink.text().trim();

            const tradeVolume = parseNumber(element, 5);
            const tradeAmount = parseNumber(element, 6) * 1000000;
            const priorTradeAmount = parseNumber(element, 7);
            const marketCap = parseNumber(element, 8) * 100000000;
            const foreignerRatio = parseNumber(element, 9);
            stocks.push({
                stockCode,
                stockName,
                tradeVolume,
                tradeAmount,
                priorTradeAmount,
                marketCap,
                foreignerRatio,
            });
        });

        await this.themeService.create({
            code: payload.code,
            name: themeName,
            averageMarketCapPerStock: 0,
            averageTradingValuePerStock: 0,
            averageTradingVolumePerStock: 0,
            stockCount: stocks.length,
        });
    }


}
