const express = require('express');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');

const router = express.Router();

// Proxy to server running on local network
router.use('/', createProxyMiddleware('/', {
  changeOrigin: true,
  onProxyReq: fixRequestBody,
  pathRewrite: (path) => {
    return path.split('/').slice(2).join('/');
  },
  secure: false,
  target: 'http://localhost:8001',
}));

module.exports = router;