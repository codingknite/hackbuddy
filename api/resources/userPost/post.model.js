const mongoose = require('mongoose');
const postSchema = require('./post.schema');

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
