const winston = require('winston');
require('winston-loggly-bulk');
require('dotenv').config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.label({ label: 'web-server'}),
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: `./log/${new Date().getTime()}-log.txt`,
    }),
    new winston.transports.Loggly({
      inputToken: process.env.LOGGLY_TOKEN,
      subdomain: process.env.LOGGLY_SUBDOMAIN,
      tags: ['web-server'],
      json: true,
    }),
  ],
});

module.exports = logger;