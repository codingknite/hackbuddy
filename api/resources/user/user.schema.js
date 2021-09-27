/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  profilePicUrl: {
    type: String,
    default: null,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  country: {
    type: String,
    lowercase: true,
  },
  language: {
    type: String,
    default: 'english',
    lowercase: true,
  },
  tech: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  expertise: {
    type: String,
    lowercase: true,
  },
  shortDescription: {
    type: String,
    maxlength: 250,
    trim: true,
  },
  description: {
    trim: true,
    type: String,
  },
  website: {
    trim: true,
    type: String,
  },
  github: {
    trim: true,
    type: String,
  },
  twitter: {
    type: String,
    trim: true,
  },
  linkedin: {
    type: String,
    trim: true,
  },
  hashnode: {
    type: String,
    trim: true,
  },
});

userSchema.set('toJSON', {
  transform: (document, object) => {
    object.id = object._id.toString();
    delete object._id;
    delete object.__v;
  },
});

userSchema.plugin(uniqueValidator);

module.exports = userSchema;
