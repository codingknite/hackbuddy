/* eslint-disable no-console */

const User = require('./user.model');

const createUser = async (req, res) => {
  try {
    const { body } = req;

    const newUser = new User({
      ...body,
    });
    const savedUser = await newUser.save();

    res.status(201).json({
      status: 'success',
      message: 'User Created Successfully',
      data: {
        ...savedUser,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

const getUser = async (req, res) => {
  try {
    const { userName } = req.params;

    const user = await User.findOne({ userName }).lean().exec();

    if (!user) {
      res.status(400).end();
    }

    res.status(200).json({
      status: 'success',
      message: 'User Retrieved Successfully',
      data: {
        ...user,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({}).lean().exec();

    if (!allUsers) {
      res.status(400).end();
    }

    res.status(200).json({
      status: 'success',
      message: 'Users Retrieved Successfully',
      data: {
        ...allUsers,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

const updateUser = async (req, res) => {
  try {
    const { body } = req;
    const { userName } = req.params;

    const updatedInfo = await User.findOneAndUpdate({ userName }, { ...body })
      .lean()
      .exec();

    if (!updatedInfo) {
      res.status(400).end();
    }

    res.status(201).json({
      status: 'success',
      message: 'User Updated Successfully',
      data: {
        ...updatedInfo,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userName } = req.params;
    const removed = await User.findOneAndRemove({ userName }).lean().exec();

    if (!removed) {
      res.status(400).end();
    }

    res.status(204).json({
      status: 'success',
      message: 'User Deleted Successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

const queryUsers = async (req, res) => {
  try {
    const {
      email, tech, country, expertise, language,
    } = req.query;

    let queries = {};

    if (tech) queries = { ...queries, tech };
    if (email) queries = { ...queries, email };
    if (country) queries = { ...queries, country };
    if (language) queries = { ...queries, language };
    if (expertise) queries = { ...queries, expertise };

    const queryResults = await User.find({ ...queries })
      .lean()
      .exec();

    if (!queryResults) {
      res.status(400).end();
    }

    res.status(200).json({
      status: 'success',
      message: 'Query Successful',
      data: {
        ...queryResults,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

module.exports = {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  queryUsers,
  getAllUsers,
};
