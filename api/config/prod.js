require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_PROD;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN_PROD;

module.exports = {
  MONGODB_URI,
  CLIENT_ORIGIN,
};
