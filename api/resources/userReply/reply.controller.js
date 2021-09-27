/* eslint-disable no-console */
const Reply = require('./reply.model');
const { replyController } = require('../../utils/reply');

const postReplyController = replyController(Reply);

const getAllReplies = async (req, res) => {
  try {
    const { postID } = req.params;
    const replies = await Reply.find({ postID }).lean().exec();

    if (!replies) {
      res.status(400).end();
    }

    res.status(200).json({
      status: 'success',
      message: 'Replies Retrieved Successfully',
      data: {
        ...replies,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

module.exports = { postReplyController, getAllReplies };
