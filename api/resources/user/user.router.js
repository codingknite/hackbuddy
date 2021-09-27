const { Router } = require('express');

const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
  queryUsers,
  getAllUsers,
} = require('./user.controller');

const { checkJwt } = require('../../middleware/auth.middleware');

const router = Router();

router.route('/').get(getAllUsers).post(checkJwt, createUser);

router.route('/query').get(queryUsers);

router
  .route('/:userName')
  .get(getUser)
  .patch(checkJwt, updateUser)
  .delete(checkJwt, deleteUser);

module.exports = router;
