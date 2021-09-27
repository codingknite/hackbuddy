const mongoose = require('mongoose');
const userSchema = require('./user.schema');

const User = mongoose.model('User', userSchema);

module.exports = User;
