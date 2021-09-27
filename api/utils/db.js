/* eslint-disable no-console */
const mongoose = require('mongoose');
const config = require('../config/index');

const { envConfig } = config;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: false,
  useFindAndModify: false,
};

const connectToDB = async () => {
  try {
    await mongoose.connect(envConfig.MONGODB_URI, { ...options });
  } catch (error) {
    console.error(error);
  }
};

module.exports = connectToDB;
