import { Theme } from './theme.schema';
import { PartialType } from '@nestjs/swagger';

export class CreateUpdateThemeRequest extends PartialType(Theme) {}
