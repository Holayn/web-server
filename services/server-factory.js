const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const morgan = require('morgan');

const logger = require('./logger');

module.exports = class ServerFactory {
  static createServer() {
    const app = express();

    app.use(helmet());
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    const morganMiddleware = morgan(
      // https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-winston-and-morgan-to-log-node-js-applications/#logging-in-an-express-application-using-winston-and-morgan
      (tokens, req, res) => {
        const message = {
          remoteAddr: tokens['remote-addr'](req, res),
          date: tokens['date'](req, res, 'iso'),
          method: tokens.method(req, res),
          url: tokens.url(req, res),
          status: tokens.status(req, res),
          responseTime: tokens['response-time'](req, res),
          referrer: tokens['referrer'](req, res),
          userAgent: tokens['user-agent'](req, res),
        }

        const messageStr = [
          `${message.remoteAddr} - [${message.date}]`,
          `"${message.method} ${message.url}"`,
          message.status,
          `${message.responseTime}ms`,
          message.referrer,
          message.userAgent,
        ].join(' ');

        return JSON.stringify({
          message: messageStr,
          ...message,
        });
      },
      { 
        stream: {
          write: (message) => {
            const { message: logMessage, ...meta } = JSON.parse(message);
            logger.http(logMessage, meta);
          }
        },
      },
    );
    app.use(morganMiddleware);

    return app;
  }

  static createProxy(port) {
    return createProxyMiddleware({
      changeOrigin: true,
      onProxyReq: fixRequestBody,
      onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['content-security-policy'] = proxyRes.headers['content-security-policy'].replace('upgrade-insecure-requests', '');
      },
      pathRewrite: (path) => {
        return path.split('/').slice(2).join('/');
      },
      secure: false,
      target: `http://localhost:${port}`,
    });
  }
}