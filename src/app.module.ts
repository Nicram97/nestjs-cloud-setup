import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import configuration from './config/configuration';
import { InfluxService } from './influxdb/influx-service';
import { LogTimeMiddleware } from './logger/log-time-middleware';
import { WinstonConfigService } from './logger/winston-config-service';
import { PrometheusModule } from './prometheus/prometheus.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [configuration],
      ignoreEnvFile: true,
      isGlobal: true,
    }),
    WinstonModule.forRootAsync({
      useClass: WinstonConfigService,
    }),
    PrometheusModule,
  ],
  controllers: [AppController],
  providers: [InfluxService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogTimeMiddleware).forRoutes('*');
  }
}
