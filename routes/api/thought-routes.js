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

// Add new Reaction
router
  .route('/:userId/:thoughtId')
  .put(addReaction)
  .delete(removeThought)

// Remove Reaction
router
  .route('/:userId/:thoughtId/:ReactionId')
  .delete(removeReaction);

// /api/Thoughts/:userId/:thoughtId
router
  .route('/:userId/:thoughtId')
  .delete(removeThought);

module.exports = router;
