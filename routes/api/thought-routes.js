const router = require('express').Router();
const {
  getAllThought,
  addThought,
  removeThought,
  addReaction,
  removeReaction
} = require('../../controllers/thought-controller');


// /api/thoughts
router
  .route('/')
  .post(addThought)
  .get(getAllThought);

// /api/thoughts/:userId/:thoughtId
router
  .route('/:thoughtId')
  .delete(removeThought);

router
  .route('/:thoughtId/reactions')
  .put(addReaction);

// api/thoughts/:userId/:thougthId/:reactionId
router
  .route('/:userId/:thoughtId/:reactionId')
  .delete(removeReaction);

module.exports = router;
