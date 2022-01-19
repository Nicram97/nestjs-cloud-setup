import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
  OnModuleInit,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Summary } from 'prom-client';
import { PrometheusService } from '../prometheus/prometheus.service';

@Injectable()
export class LogTimeMiddleware implements NestMiddleware, OnModuleInit {
  private responseTimeSummary: Summary<string>;
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    private readonly prometheusService: PrometheusService,
  ) {}
  async onModuleInit(): Promise<void> {
    this.responseTimeSummary = await this.prometheusService.registerSummary({
      name: 'response_times',
      help: 'Response time in milliseconds',
      labelNames: ['method', 'url', 'status'],
      aggregator: 'average',
    });
  }

  use(req: Request, res: Response, next: NextFunction): void {
    this.logger.log(`${req.method} ${req.originalUrl} [STARTED]`);
    const startAt = process.hrtime();

    res.on('finish', () => {
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      this.logger.log(
        `${req.method} ${
          req.originalUrl
        } [FINISHED] ${responseTime.toLocaleString()} ms`,
      );
    });

    res.on('close', () => {
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      this.logger.log(
        `${req.method} ${
          req.originalUrl
        } [CLOSED] ${responseTime.toLocaleString()} ms`,
      );
      this.responseTimeSummary
        .labels(req.method, req.originalUrl, res.statusCode.toString())
        .observe(responseTime);
    });

    next();
  }
}
