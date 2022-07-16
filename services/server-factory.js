const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');

const logger = require('./logger');

module.exports = class ServerFactory {
  static createServer() {
    const app = express();

    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use((req, res, next) => {
      const { baseUrl, hostname, ip, method, originalUrl } = req;
      const log = {
        baseUrl,
        hostname,
        ip,
        method,
        status: res.statusCode,
        timestamp: new Date(),
        url: originalUrl,
        userAgent: req.headers['user-agent'],
      };

      logger.info('Request Logging', log);

      next();
    });

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