const jwt = require('express-jwt');
const JwksRsa = require('jwks-rsa');
const config = require('../config/index');

const { devConfig } = config;

const checkJwt = jwt({
  secret: JwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${devConfig.AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),

  audience: devConfig.AUTH0_AUDIENCE,
  issuer: `https://${devConfig.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

module.exports = { checkJwt };
