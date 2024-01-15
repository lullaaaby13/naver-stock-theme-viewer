import { WinstonModule } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities';

export const winstonLogger = WinstonModule.createLogger({
    transports: [
        new DailyRotateFile({
            filename: 'app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '2m',
            maxFiles: '1000',
            level: 'info',
            dirname: 'logs', // 로그 파일을 저장할 디렉토리
            // 다른 옵션들...
        }),
        // 콘솔 로거 추가 (선택 사항)
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                nestWinstonModuleUtilities.format.nestLike('NaverStockViewer', {
                    colors: true,
                    prettyPrint: true,
                }),
            ),
        }),
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('NaverStockViewer', {
            colors: true,
            prettyPrint: true,
        }),
    ),
});
