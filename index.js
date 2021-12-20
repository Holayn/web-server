const express = require('express');
const path = require('path');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const logger = require('./services/logger');

const audioStore = require('./routes/audio-store');
const photos = require('./routes/photos');

require('dotenv').config();

const app = express();

app.use(cors());
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

app.use('/audio-store', audioStore);
app.use('/photos', photos);
app.use('/favicon.ico', express.static(path.join(__dirname, './static/favicon.ico')));

const httpsServer = https.createServer({
  key: fs.readFileSync(__dirname + '/sslcert/privkey1.pem', 'utf8'),
  cert: fs.readFileSync(__dirname + '/sslcert/fullchain1.pem', 'utf8'),
}, app);
const port = process.env.PORT || 8000;
httpsServer.listen(port, () => {
  console.log(`---Server started on ${port}---`);
});
