require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_LOCAL;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN_DEV;

module.exports = {
  MONGODB_URI,
  CLIENT_ORIGIN,
};
