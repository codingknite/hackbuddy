require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_TEST;

module.exports = {
  MONGODB_URI,
};
