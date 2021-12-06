const express = require('express');
const history = require('connect-history-api-fallback');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const helmet = require("helmet");

const router = express.Router();

router.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    defaultSrc: ["'self'"],
    fontSrc: ["'self'", 'data:', 'https://cdnjs.cloudflare.com'],
    imgSrc: ["'self'", 'data:', 'https://cdnjs.cloudflare.com'],
    mediaSrc: ["'self'", 'data:'],
    styleSrc: ["'self'"],
    scriptSrc: ['https://storage.googleapis.com', 'https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net'],
  },
}));
router.use(history({
  rewrites: [
    {
      from: /^\/api/,
      to: function(context) {
        return context.parsedUrl.pathname;
      },
    },
  ],
  verbose: true
}));

router.use('/', express.static(path.join(__dirname, '../static/audio-store')));

// Proxy to server running on local network
router.use('/api', createProxyMiddleware({ target: 'https://192.168.0.133:8000', changeOrigin: true, secure: false }));

module.exports = router;