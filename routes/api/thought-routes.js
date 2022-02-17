const router = require('express').Router();
const {
  addThought,
  removeThought,
  addReaction,
  removeReaction
} = require('../../controllers/thought-controller');


// /api/thoughts/<userId>
router
  .route('/:userId')
  .post(addThought);

// Add new Reaction
router
  .route('/:userId/:thoughtId')
  .put(addReaction)
  .delete(removeThought)

// Remove Reaction
router
  .route('/:userId/:thoughtId/:ReactionId')
  .delete(removeReaction);

// /api/Thoughts/<userId>/<thoughtId>
router
  .route('/:userId/:thoughtId')
  .delete(removeThought);

module.exports = router;
