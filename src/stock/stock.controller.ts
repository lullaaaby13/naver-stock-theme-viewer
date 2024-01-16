import { Controller, Get } from '@nestjs/common';
import StockService from './stock.service';

@Controller('stocks')
export default class StockController {
    constructor(private readonly stockService: StockService) {}

    @Get()
    async list() {
        return this.stockService.list();
    }
}
