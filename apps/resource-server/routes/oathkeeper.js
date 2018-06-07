const express = require('express');
const jwt = require('express-jwt');
const router = express.Router();
const jwksRsa = require('jwks-rsa');

// For infos check https://github.com/auth0/node-jwks-rsa/tree/master/examples/express-demo
const client = jwksRsa.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksUri: process.env.OATHKEEPER_KEY_URL,
  algorithms: ['RS256']
});

router.get('/', jwt({ secret: client }), function (req, res, next) {
  res.json({ message: 'Congratulations, you gained access to this endpoint!', tokenClaims: req.user });
});

/* GET home page. */
module.exports = router;
