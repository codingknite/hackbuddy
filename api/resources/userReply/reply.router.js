const { Router } = require('express');
const { getAllReplies, postReplyController } = require('./reply.controller');
const { checkJwt } = require('../../middleware/auth.middleware');

const router = Router();

router.route('/').post(checkJwt, postReplyController.createReply);

router
  .route('/:uniqueID')
  .patch(checkJwt, postReplyController.updateReply)
  .delete(checkJwt, postReplyController.deleteReply);

router.route('/:postID').get(getAllReplies);

module.exports = router;
