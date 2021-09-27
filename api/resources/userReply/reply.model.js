const mongoose = require('mongoose');
const replySchema = require('./reply.schema');

const Reply = mongoose.model('reply', replySchema);

module.exports = Reply;
