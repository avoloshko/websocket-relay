import winston, {format} from 'winston';
import fs from 'fs';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as util from 'util';

import config from 'src/config/settings';

const {combine, timestamp, printf, colorize} = format;

fs.mkdir(config.logFolder, () => {});

const logger = winston.createLogger({
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    trace: 4,
    debug: 5
  },
  transports: [
    new winston.transports.Console({
      level: config.logLevel,
      format: combine(
        colorize(),
        timestamp(),
        printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`),
      )
    }),
    new DailyRotateFile({
      filename: config.logFolder + '/log.%DATE%.txt',
      datePattern: 'yyyy-MM-DD',
      json: false,
      level: config.logLevel,
      maxFiles: '7d',
      format: combine(
        timestamp(),
        printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`),
      )
    })
  ]
});

const formatArgs = (...args: any[]) => args.map((a) => util.format(a)).join(' ');

console.log = (...args: any[]) => logger.info(formatArgs(...args));
console.info = (...args: any[]) => logger.info(formatArgs(...args));
console.warn = (...args: any[]) => logger.warn(formatArgs(...args));
console.error = (...args: any[]) => logger.error(formatArgs(...args));
console.debug = (...args: any[]) => logger.debug(formatArgs(...args));

logger.child = function() { return logger; };

export default logger;
