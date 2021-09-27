/* eslint-disable no-console */
const SubReply = require('./subReply.model');
const { replyController } = require('../../utils/reply');

const subReplyController = replyController(SubReply);

const getAllSubReplies = async (req, res) => {
  try {
    const { replyID } = req.params;
    const subReplies = await SubReply.find({ replyID }).lean().exec();

    if (!subReplies) {
      res.status(400).end();
    }

    res.status(200).json({
      status: 'success',
      message: 'SubReplies Retrieved Successfully',
      data: {
        ...subReplies,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

module.exports = { subReplyController, getAllSubReplies };
