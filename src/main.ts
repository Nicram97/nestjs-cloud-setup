import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { winstonLoggerMiddleware } from './logger/log-req-res-body-middleware';
import * as actuator from 'express-actuator';
import { actuatorOptions } from './actuator/actuator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(winstonLoggerMiddleware(app.get(WINSTON_MODULE_NEST_PROVIDER)));
  app.use(actuator(actuatorOptions));
  await app.listen(3000);
}
bootstrap();
