import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class LogTimeMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
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
    });

    next();
  }
}
