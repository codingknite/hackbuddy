const { Router } = require('express');
const {
  getAllPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
  queryPosts,
} = require('./post.controller');

const { checkJwt } = require('../../middleware/auth.middleware');

const router = Router();

router.route('/').get(getAllPosts).post(checkJwt, createPost);

router.get('/query', queryPosts);

router
  .route('/:postID')
  .get(getPost)
  .patch(checkJwt, updatePost)
  .delete(checkJwt, deletePost);

module.exports = router;
