/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const subReplySchema = new mongoose.Schema({
  uniqueID: {
    type: String,
    required: true,
  },
  replyID: {
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

subReplySchema.set('toJSON', {
  transform: (document, object) => {
    object.id = object._id.toString();
    delete object._id;
    delete object.__v;
  },
});

subReplySchema.plugin(mongooseUniqueValidator);

module.exports = subReplySchema;
