import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './utils/extentions/puppeteer/index';
import './utils/extentions/common/index';
import { winstonLogger } from './winston.logger';

console.log('isDevelopment', process.env.NODE_ENV === 'development');
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useLogger(winstonLogger);
    await app.listen(3000);
}
bootstrap();
