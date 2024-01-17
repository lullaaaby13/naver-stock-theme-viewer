import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import CrawlerModule from './crawler/crawler.module';
import EventModule from './events/event.module';
import ThemeModule from './theme/theme.module';
import { ScheduleModule } from '@nestjs/schedule';
import SchedulerModule from './scheduler/scheduler.module';

@Module({
    imports: [
        // MongooseModule.forRoot('mongodb://localhost:27017/naver-stock-viewer', {
        //     dbName: 'naver-stock-viewer',
        //     user: 'naver-stock-viewer',
        //     pass: 'naver-stock-viewer',
        // }),
        MongooseModule.forRoot('mongodb://127.0.0.1:27017/naver-stock-viewer?directConnection=true&serverSelectionTimeoutMS=2000'),
        EventEmitterModule.forRoot({
            // set this to `true` to use wildcards
            wildcard: false,
            // the delimiter used to segment namespaces
            delimiter: '.',
            // set this to `true` if you want to emit the newListener event
            newListener: false,
            // set this to `true` if you want to emit the removeListener event
            removeListener: false,
            // the maximum amount of listeners that can be assigned to an event
            maxListeners: 50,
            // show event name in memory leak message when more than maximum amount of listeners is assigned
            verboseMemoryLeak: false,
            // disable throwing uncaughtException if an error event is emitted and it has no listeners
            ignoreErrors: false,
        }),
        ScheduleModule.forRoot(),
        CrawlerModule,
        EventModule,
        ThemeModule,
        SchedulerModule,
    ],
})
export class AppModule {}
