import { Stock } from './stock.schema';
import { PartialType } from '@nestjs/swagger';

export class CreateUpdateStockRequest extends PartialType(Stock) {}
