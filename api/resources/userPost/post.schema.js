/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const postSchema = new mongoose.Schema({
  uniqueID: {
    type: String,
    unique: true,
  },
  author: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    lowercase: true,
    required: true,
  },
  comments: {
    type: Number,
    default: 0,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

postSchema.set('toJSON', {
  transform: (document, object) => {
    object.id = object._id.toString();
    delete object._id;
    delete object.__v;
  },
});

postSchema.plugin(uniqueValidator);

module.exports = postSchema;
