import winston from 'winston';
import * as expressWinston from 'express-winston';

export const winstonLoggerMiddleware = (
  winstonLoggerInstance: winston.Logger,
) => {
  const result = expressWinston.logger({
    winstonInstance: winstonLoggerInstance,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}}',
    expressFormat: true,
  });
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  return result;
};
