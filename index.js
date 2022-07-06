const express = require('express');
const path = require('path');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');

const logger = require('./services/logger');

const audioStore = require('./routes/audio-store');
const photos = require('./routes/photos');
const budget = require('./routes/budget');

require('dotenv').config();

const app = express();

// Don't reveal this information...
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

app.use('/healthcheck', (req, res) => res.sendStatus(200));
app.use('/audio-store', audioStore);
app.use('/photos', photos);
app.use('/budget', budget);
app.use('/', express.static(path.join(__dirname, './static')));

app.listen(80, () => {
  console.log(`---HTTP started on 80---`);
});

try {
  const httpsServer = https.createServer({
    cert: fs.readFileSync(path.join(__dirname, './sslcert/fullchain.pem')),
    key: fs.readFileSync(path.join(__dirname, './sslcert/privkey.pem')),
  }, app);
  const port = process.env.PORT || 443;
  httpsServer.listen(port, () => {
    console.log(`---HTTPS started on ${port}---`);
  });
} catch (e) {
  console.log('HTTPS server failed to start.');
}

