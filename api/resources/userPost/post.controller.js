/* eslint-disable no-console */
const { nanoid } = require('nanoid');
const Post = require('./post.model');

const createPost = async (req, res) => {
  try {
    const { body } = req;

    const newPost = new Post({
      uniqueID: nanoid(10),
      ...body,
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      status: 'success',
      message: 'Post Created Successfully',
      data: {
        ...savedPost,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({}).lean().exec();

    if (!allPosts) {
      res.status(400).end();
    }

    res.status(200).json({
      status: 'success',
      message: 'Posts Retrieved Successfully',
      data: {
        ...allPosts,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

const getPost = async (req, res) => {
  try {
    const { postID } = req.params;

    const post = await Post.find({ uniqueID: postID });

    if (!post) {
      res.status(400).end();
    }

    res.status(200).json({
      status: 'success',
      message: 'Post Retrieved Successfully',
      data: {
        ...post,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

const updatePost = async (req, res) => {
  try {
    const { body } = req;
    const { postID } = req.params;

    const updatedPost = await Post.findOneAndUpdate(
      { uniqueID: postID },
      {
        ...body,
      }
    );

    if (!updatedPost) {
      res.status(400).end();
    }

    res.status(201).json({
      status: 'success',
      message: 'Post Updated Successfully',
      data: {
        ...updatedPost,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

const deletePost = async (req, res) => {
  try {
    const { postID } = req.params;

    const deletedPost = await Post.deleteOne({ uniqueID: postID });

    if (!deletedPost) {
      res.status(400).end();
    }

    res.status(204).json({
      status: 'Successful',
      message: 'Post Deleted Successfully',
    });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

const queryPosts = async (req, res) => {
  try {
    const { email, userName } = req.query;

    let queries = {};

    if (email) queries = { ...queries, email };
    if (userName) queries = { ...queries, userName };

    const allPosts = await Post.find({ ...queries });

    if (!allPosts) {
      res.status(400).end();
    }

    res.status(200).json({
      status: 'success',
      message: 'Posts Retrieved Successfully',
      data: {
        ...allPosts,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(400).end();
  }
};

module.exports = {
  getPost,
  updatePost,
  deletePost,
  queryPosts,
  createPost,
  getAllPosts,
};
