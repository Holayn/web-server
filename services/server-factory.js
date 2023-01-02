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
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
      { 
        stream: {
          write: (message) => logger.http(message),
        }
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