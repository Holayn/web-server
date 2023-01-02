const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
require('winston-loggly-bulk');
require('dotenv').config();

const logger = createLogger({
  level: 'http',
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(), 
    format.align(),
    format.printf(({ level, message, timestamp, stack, ...meta }) => {
      return `${timestamp} ${level}: ${message}${Object.keys(meta).length ? ` - ${JSON.stringify(meta)}` : ''}${stack ? `\n${stack}` : ''}`
    }),
  ),
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      filename: `./log/%DATE%-error.log`,
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new transports.DailyRotateFile({ 
      filename: `./log/%DATE%-info.log`,
      level: 'info',
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new transports.DailyRotateFile({ 
      filename: `./log/%DATE%.log`,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    new transports.Loggly({
      inputToken: process.env.LOGGLY_TOKEN,
      subdomain: process.env.LOGGLY_SUBDOMAIN,
      tags: ['web-server'],
      json: true,
    }),
  ],
});

module.exports = logger;