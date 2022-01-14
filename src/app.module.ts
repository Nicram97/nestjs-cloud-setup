import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import configuration from './config/configuration';
import { LogTimeMiddleware } from './logger/log-time-middleware';
import { WinstonConfigService } from './logger/winston-config-service';
import { InfluxdbModule } from './influxdb/influxdb.module';

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
    InfluxdbModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogTimeMiddleware).forRoutes('*');
  }
}
