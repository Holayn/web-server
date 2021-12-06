// TODO: this should go into dedicated server for photo-gallery

const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require("helmet");

const router = express.Router();

const AVAILABLE_ALBUMS = ['101721-camping'];
const ALBUM_TITLES = {
  '101721-camping': 'Camping Trip - October 17, 2021',
}

router.use(helmet.contentSecurityPolicy({
  useDefaults: true,
  directives: {
    defaultSrc: ["'self'", "'unsafe-inline'"],
    fontSrc: ["'self'", 'data:', 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
    imgSrc: ["'self'", 'data:', 'https://a.tile.openstreetmap.org', 'https://b.tile.openstreetmap.org', 'https://c.tile.openstreetmap.org', 'https://cdnjs.cloudflare.com'],
    mediaSrc: ["'self'", 'data:'],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
    scriptSrc: ["'self'", 'https://storage.googleapis.com', 'https://cdnjs.cloudflare.com', 'https://cdn.jsdelivr.net', 'https://code.jquery.com'],
  },
}));

router.use('/test', (req, res) => {
  res.sendStatus(200);
});
router.use('/', express.static(path.join(__dirname, '../static/photos')));
router.use('/config', (req, res) => {
  const album = req.query.album;
  if (AVAILABLE_ALBUMS.includes(album)) {
    res.send(fs.readFileSync(path.join(__dirname, `../config/photos/thumbsup/${album}/photos.json`)));
  } else {
    res.sendStatus(404);
  }
});
router.use('/title', (req, res) => {
  res.send({
    title: ALBUM_TITLES[req.query.album]
  });
});

module.exports = router;