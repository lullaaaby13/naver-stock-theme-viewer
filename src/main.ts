import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './utils/extentions/puppeteer/index';
import './utils/extentions/common/index';
import { winstonLogger } from './winston.logger';

console.log('isDevelopment', process.env.NODE_ENV === 'development');
const port = process.env.PORT || 3000;
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useLogger(winstonLogger);
    app.setGlobalPrefix('api');
    await app.listen(port).then(() => console.log(`Server is listening on port ${port}`));
}
bootstrap();
