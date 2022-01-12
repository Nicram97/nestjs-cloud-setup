import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Summary } from 'prom-client';

@Injectable()
export class LogTimeMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
    @InjectMetric('response_times') private readonly sumary: Summary<string>,
  ) {}

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
      this.sumary
        .labels(req.method, req.originalUrl, res.statusCode.toString())
        .observe(responseTime);
    });

    next();
  }
}
