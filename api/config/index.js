const devEnvironment = require('./dev');
const prodEnvironment = require('./prod');
const testingEnvironment = require('./testing');

require('dotenv').config();

const { PORT, AUTH0_DOMAIN, AUTH0_AUDIENCE } = process.env;

const env = process.env.NODE_ENV || 'development';
let envConfig = {};

switch (env) {
  case 'development':
    envConfig = devEnvironment;
    break;
  case 'production':
    envConfig = prodEnvironment;
    break;
  case 'testing':
    envConfig = testingEnvironment;
    break;
  default:
    envConfig = devEnvironment;
}

const devConfig = {
  PORT,
  AUTH0_DOMAIN,
  AUTH0_AUDIENCE,
};

module.exports = {
  devConfig,
  envConfig,
};
