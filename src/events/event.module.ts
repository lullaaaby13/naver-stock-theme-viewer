import { Module } from '@nestjs/common';
import ThemeModule from '../theme/theme.module';
import CollectedEventHandler from './collected-event.handler';

@Module({
    imports: [ThemeModule],
    providers: [CollectedEventHandler],
})
export default class EventModule {}
