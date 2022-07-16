const connectHistoryApiFallback = require('connect-history-api-fallback');
const express = require('express');
const helmet = require('helmet');

const serverFactory = require('../services/server-factory');

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
router.use(connectHistoryApiFallback({
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

router.use('/', serverFactory.createProxy(process.env.AUDIO_STORE_PORT));

module.exports = router;