import * as winston from 'winston';
import { logConfig } from '../config/settings';

const logger = winston.createLogger({
  level: logConfig.level,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
      const errorStack = stack ? `\n${stack}` : '';
      return `[${timestamp}] [${level.toUpperCase()}] ${message}${errorStack}`;
    }),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level} ${message}`;
        }),
      ),
    }),
  ],
});

export default logger;
