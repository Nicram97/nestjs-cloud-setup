import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  makeSummaryProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import configuration from './config/configuration';
import { LogTimeMiddleware } from './logger/log-time-middleware';
import { WinstonConfigService } from './logger/winston-config-service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
    }),
    PrometheusModule.register(),
  ],
  controllers: [AppController],
  providers: [
    makeSummaryProvider({
      name: 'response_times',
      help: 'Response time in milliseconds',
      labelNames: ['method', 'url', 'status'],
      aggregator: 'average',
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogTimeMiddleware).forRoutes('*');
  }
}
