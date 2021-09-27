/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const replySchema = new mongoose.Schema({
  uniqueID: {
    type: String,
    required: true,
  },
  postID: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

replySchema.set('toJSON', {
  transform: (document, object) => {
    object.id = object._id.toString();
    delete object._id;
    delete object.__v;
  },
});

replySchema.plugin(mongooseUniqueValidator);

module.exports = replySchema;
