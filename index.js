const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const serverFactory = require('./services/server-factory');

const audioStore = require('./routes/audio-store');
const budget = require('./routes/budget');
const keepass = require('./routes/keepass');
const photos = require('./routes/photos');

require('dotenv').config();

const httpApp = serverFactory.createServer();
const httpPort = process.env.HTTP_PORT || 80;
httpApp.use('/', express.static(path.join(__dirname, './static')));
http.createServer(httpApp).listen(httpPort, () => {
  console.log(`---HTTP started on ${httpPort}---`);
});

const internalApp = serverFactory.createServer();
const internalPort = process.env.INTERNAL_PORT || 9000;
internalApp.use('/audio-store', audioStore);
internalApp.use('/budget', budget);
internalApp.use('/healthcheck', (req, res) => res.sendStatus(200));
http.createServer(internalApp).listen(internalPort, () => {
  console.log(`---INTERNAL started on ${internalPort}---`);
});

try {
  const httpsApp = serverFactory.createServer();
  const httpsPort = process.env.HTTPS_PORT || 443;
  httpsApp.use('/healthcheck', (req, res) => res.sendStatus(200));
  httpsApp.use('/photos', photos);
  httpsApp.use('/keepass', keepass);
  https.createServer({
    cert: fs.readFileSync(path.join(__dirname, `./sslcert/${FILE_NAME_CERT}.pem`)),
    key: fs.readFileSync(path.join(__dirname, `./sslcert/${FILE_NAME_KEY}.pem`)),
  }, httpsApp).listen(httpsPort, () => {
    console.log(`---HTTPS started on ${httpsPort}---`);
  });
} catch (e) {
  console.error(e);
  console.error('---HTTPS failed to start---');
}
