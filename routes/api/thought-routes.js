const router = require('express').Router();
const {
  addThought,
  removeThought,
  addReply,
  removeReply
} = require('../../controllers/thought-controller');


// /api/thoughts/<userId>
router
  .route('/:userId')
  .post(addThought);

// Add new Reply
router
  .route('/:userId/:thoughtId')
  .put(addReply)
  .delete(removeThought)

// Remove Reply
router
  .route('/:userId/:thoughtId/:replyId')
  .delete(removeReply);

// /api/Thoughts/<userId>/<thoughtId>
router
  .route('/:userId/:thoughtId')
  .delete(removeThought);

module.exports = router;
