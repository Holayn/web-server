const express = require('express');

const serverFactory = require('../services/server-factory');

require('dotenv').config();

const router = express.Router();

router.use('/', serverFactory.createProxy(process.env.PHOTOS_PORT));

module.exports = router;