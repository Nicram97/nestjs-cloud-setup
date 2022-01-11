import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  WinstonModuleOptionsFactory,
  utilities as nestWinstonUtilities,
  WinstonModule,
} from 'nest-winston';
import { LoggerOptions } from 'winston';
import { LogstashTransport } from 'winston-logstash-ts';
import * as logform from 'logform';
import * as winston from 'winston';

@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createWinstonModuleOptions(): LoggerOptions | Promise<LoggerOptions> {
    if (this.configService.get<string>('logstash.LOGSTASH_HOST')) {
      return {
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonUtilities.format.nestLike(),
        ),
        transports: [
          new winston.transports.Console(),
          new LogstashTransport({
            host: this.configService.get<string>('logstash.LOGSTASH_HOST'),
            port: this.configService.get<number>('logstash.LOGSTASH_PORT'),
            protocol: this.configService.get<'tcp' | 'udp'>(
              'logstash.LOGSTASH_PROTOCOL',
            ),
            format: logform.format.combine(
              logform.format.timestamp(),
              logform.format.logstash(),
            ),
          }),
        ],
      };
    }
    return {
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonUtilities.format.nestLike(),
      ),
    };
  }
}
