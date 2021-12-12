const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const router = express.Router();

// Proxy to server running on local network
router.use('/', createProxyMiddleware('/', {
  changeOrigin: true,
  pathRewrite: (path) => {
    return path.split('/').slice(2).join('/');
  },
  secure: false,
  target: 'http://localhost:8000',
}));

module.exports = router;