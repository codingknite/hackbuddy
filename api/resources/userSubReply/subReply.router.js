const { Router } = require('express');
const {
  getAllSubReplies,
  subReplyController,
} = require('./subReply.controller');
const { checkJwt } = require('../../middleware/auth.middleware');

const router = Router();

router.route('/').post(checkJwt, subReplyController.createReply);

router
  .route('/:uniqueID')
  .patch(checkJwt, subReplyController.updateReply)
  .delete(checkJwt, subReplyController.deleteReply);

router.route('/:replyID').get(getAllSubReplies);

module.exports = router;
