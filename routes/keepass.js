const express = require('express');

const router = express.Router();

router.use('/', express.static(process.env.KEEPASS_PATH));

module.exports = router;