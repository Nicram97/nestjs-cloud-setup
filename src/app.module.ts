import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import { AppController } from './app.controller';
import configuration from './config/configuration';
import { LogTimeMiddleware } from './logger/log-time-middleware';
import { WinstonConfigService } from './logger/winston-config-service';
import { InfluxdbModule } from './influxdb/influxdb.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbService } from './db/db.service';
import { UserModule } from './user/user.module';
import { CarsModule } from './cars/cars.module';

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
    TypeOrmModule.forRootAsync({
      useClass: DbService,
    }),
    InfluxdbModule,
    UserModule,
    CarsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogTimeMiddleware).forRoutes('*');
  }
}
