import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { winstonLoggerMiddleware } from './logger/log-req-res-body-middleware';
import * as actuator from 'express-actuator';
import { actuatorOptions } from './actuator/actuator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(winstonLoggerMiddleware(app.get(WINSTON_MODULE_NEST_PROVIDER)));
  app.use(actuator(actuatorOptions));
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('Nestjs-cloud-setup')
    .setDescription('Cloud-setup API description')
    .setVersion('1.0')
    .addTag('nestjs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3010);
}
bootstrap();
