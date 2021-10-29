const express = require('express');
const path = require('path');

const router = express.Router();

router.use('/test', (req, res) => {
  res.sendStatus(200);
});
router.use('/101721-camping', express.static(path.join(__dirname, '../static/101721-camping')));

module.exports = router;