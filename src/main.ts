import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { winstonLoggerMiddleware } from './logger/log-req-res-body-middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(winstonLoggerMiddleware(app.get(WINSTON_MODULE_NEST_PROVIDER)));
  await app.listen(3000);
}
bootstrap();
