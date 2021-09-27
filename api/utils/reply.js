/* eslint-disable no-console */
const { nanoid } = require('nanoid');

const createReply = (Model) => async (req, res, next) => {
  try {
    const { body } = req;

    const newReply = new Model({
      uniqueID: nanoid(10),
      ...body,
    });

    const savedReply = await newReply.save();

    return res.status(201).json({
      status: 'success',
      message: 'Reply Created Successfully',
      data: {
        ...savedReply,
      },
    });
  } catch (error) {
    console.error(error);
    return next();
  }
};

const updateReply = (Model) => async (req, res, next) => {
  try {
    const { body } = req;
    const { uniqueID } = req.params;

    const updatedReply = await Model.findOneAndUpdate(
      { uniqueID },
      {
        ...body,
      }
    )
      .lean()
      .exec();

    if (!updatedReply) {
      return res.status(400).end();
    }
    return res.status(201).json({
      status: 'success',
      message: 'Reply Updated Successfully',
      data: {
        ...updatedReply,
      },
    });
  } catch (error) {
    console.error(error);
    return next();
  }
};

const deleteReply = (Model) => async (req, res, next) => {
  try {
    const { uniqueID } = req.params;

    const deletedReply = await Model.findOneAndRemove({ uniqueID })
      .lean()
      .exec();

    if (!deletedReply) {
      return res.status(400).end();
    }

    return res.status(204).json({
      status: 'Successful',
      message: 'Reply Deleted Successfully',
    });
  } catch (error) {
    console.error(error);
    return next();
  }
};

const replyController = (Model) => ({
  createReply: createReply(Model),
  updateReply: updateReply(Model),
  deleteReply: deleteReply(Model),
});

module.exports = {
  createReply,
  updateReply,
  deleteReply,
  replyController,
};
