import ThemeService from '../theme/theme.service';
import { Injectable, Logger } from '@nestjs/common';
import { StockCollectedEvent, ThemeCollectedEvent } from './model';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import * as cheerio from 'cheerio';
import StockService from '../stock/stock.service';
import { DateTimeFormatter, YearMonth } from '@js-joda/core';
import { CreateUpdateStockRequest } from '../stock/model';

@Injectable()
export default class CollectedEventHandler {
    private readonly logger = new Logger(CollectedEventHandler.name);
    constructor(
        private readonly themeService: ThemeService,
        private readonly stockService: StockService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @OnEvent('theme.collected', { async: true })
    async handleThemCollectedEvent(payload: ThemeCollectedEvent) {
        const $ = cheerio.load(payload.html);
        const themeName = $('table.type_1 strong.info_title').text().trim();
        const stockRows = $('table.type_5 tr div.name_area').parent().parent();

        const stocks = [];
        const parseNumber = (element: cheerio.Element, index: number) => {
            const value = $(element).children('td').eq(index).text().trim().replace(/,/g, '');
            const number = Number(value);
            if (isNaN(number)) {
                throw new Error(`숫자 파싱 에러 [${value}`);
            }
            return number;
        };

        $(stockRows).each((index, element) => {
            const stockLink = $(element).children('td').eq(0).find('a');
            const stockCode = stockLink.attr('href').split('=')[1];
            const stockName = stockLink.text().trim();

            const tradeVolume = parseNumber(element, 5);
            const tradeAmount = parseNumber(element, 6) * 1000000;
            const priorTradeVolume = parseNumber(element, 7);
            const marketCap = parseNumber(element, 8) * 100000000;
            const foreignerRatio = parseNumber(element, 9);
            stocks.push({
                stockCode,
                stockName,
                tradeVolume,
                tradeAmount,
                priorTradeVolume,
                marketCap,
                foreignerRatio,
            });
        });

        // 테마 생성
        await this.themeService.save({
            code: payload.code,
            name: themeName,
            averageMarketCapPerStock: 0,
            averageTradingValuePerStock: 0,
            averageTradingVolumePerStock: 0,
            stockCount: stocks.length,
        });

        // 주식 생성
        await Promise.allSettled(
            stocks.map(async stock => {
                await this.stockService.save({
                    code: stock.stockCode,
                    name: stock.stockName,
                    tradeVolume: stock.tradeVolume,
                    tradeAmount: stock.tradeAmount,
                    priorTradeVolume: stock.priorTradeVolume,
                });
            }),
        );
    }

    @OnEvent('stock.collected', { async: true })
    async handleStockCollectedEvent(payload: StockCollectedEvent) {
        const request: CreateUpdateStockRequest = {};

        try {
            const $ = cheerio.load(payload.html);
            request.code = payload.code;
            request.price = Number($('div.today .no_today em').text().replace(/\D/g, ''));
            request.marketCap = Number($('#_market_sum').text().replace(/\D/g, '')) * 100000000;
            request.tradeVolume = Number($('table.no_info span.sp_txt9').siblings('em').text().replace(/\D/g, ''));
            request.tradeAmount = Number($('table.no_info span.sp_txt10').siblings('em').text().replace(/\D/g, '')) * 1000000;
            request.per = $('#_per').text().includes('N/A') ? 0 : Number($('#_per').text().replace('배', ''));

            // TODO 회계 정보 파싱
            // const fiscalYearMonths = $('table.tb_type1.tb_type1_ifrs thead')
            //     .children('tr')
            //     .eq(1)
            //     .children('th')
            //     .filter(index => index > 3)
            //     .map((index, element) => this.parseYearMonth($(element).text().trim()))
            //     .get()
            //     .filter(yearMonth => !!yearMonth);
        } catch (error) {
            this.logger.error(`주식 수집 에러 [코드 = ${payload.code}, 주소 = ${payload.url}]`);
            this.eventEmitter.emit('error', {
                from: 'stock.collected',
                args: [payload],
                error,
            });
        }

        await this.stockService.save(request);
    }

    private parseYearMonth(text?: string): YearMonth {
        if (!text || text.length < 7) return;
        return YearMonth.parse(text.substring(0, 7), DateTimeFormatter.ofPattern('yyyy.MM'));
    }
}
