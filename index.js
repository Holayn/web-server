const express = require("express");
const helmet = require("helmet");
const winston = require('winston');
const expressWinston = require('express-winston');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const audioStore = require('./routes/audio-store');

require('dotenv').config();

const app = express();

app.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", 'data:'],
    mediaSrc: ["'self'", 'data:'],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://storage.googleapis.com'],
  },
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.label({ label: 'server'}),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}: ${message}`;
    },
  )),
  meta: false,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
}));

app.use('/audio-store', audioStore);

const httpsServer = https.createServer({
  key: fs.readFileSync(__dirname + '/sslcert/privkey1.pem', 'utf8'),
  cert: fs.readFileSync(__dirname + '/sslcert/fullchain1.pem', 'utf8'),
}, app);
const port = process.env.PORT || 8000;
httpsServer.listen(port, () => {
  console.log(`---Server started on ${port}---`);
});
