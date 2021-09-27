const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const { json, urlencoded } = require('body-parser');

const connectToDB = require('./utils/db');
const userRouter = require('./resources/user/user.router');
const postRouter = require('./resources/userPost/post.router');
const replyRouter = require('./resources/userReply/reply.router');
const subReplyRouter = require('./resources/userSubReply/subReply.router');

const app = express();

connectToDB();

app.use(cors());
app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/reply', replyRouter);
app.use('/api/subreply', subReplyRouter);

module.exports = app;
