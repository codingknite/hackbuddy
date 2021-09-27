const mongoose = require('mongoose');
const subReplySchema = require('./subReply.schema');

const subReply = mongoose.model('subreply', subReplySchema);

module.exports = subReply;
