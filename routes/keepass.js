const express = require('express');
const helmet = require('helmet');

const router = express.Router();
router.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      childSrc: ["'self'", 'blob:'],
      connectSrc: ["'self'", 'ws:', 'https:'],
      defaultSrc: ["'self'"],
      fontSrc: ['data:'],
      formAction: ["'none'"],
      imgSrc: ["'self'", 'data:', 'blob:', ' https://services.keeweb.info/'],
      scriptSrc: ["'sha512-jYN26k9MdXnhqu7Ssy7r+y/87ND1Br7yx4NzRHwx8dSII1LvinqIRKaXoIb0ObI9HQFILRWBg5gPRszhILAC9g=='", "'unsafe-eval'", "'nonce-2726c7f26c'"],
      styleSrc: ["'sha512-63edYbLgq599MAsyyqgCBk18k1RCKpZ3FjZ9G3l0pQlvxVchNVaPhiAE+GwP9NKPZVIinJuNXJx2xY1tZkzvZg=='", 'blob:'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
      workerSrc: ["'self'", 'blob:']
    },
  })
);
router.use(helmet.crossOriginOpenerPolicy({ policy: 'unsafe-none' }));
router.use('/', express.static(process.env.KEEPASS_PATH));

module.exports = router;