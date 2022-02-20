const res = require('express/lib/response');
const { Thought, User } = require('../models');

const thoughtController = {
  getAllThought(req, res) {
    Thought.find({})
      // .populate({
      //   path: 'thoughts',
      //   select: '-__v'
      // })
      // .select('-__v')
      // .sort({ _id: -1 })
      .then(dbThoughtData => res.json(dbThoughtData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  async addThought({ body }, res) {
    try {
      const user = await User.exists({ username: body.username.toLowerCase() });
      if (user) {
        const thought = await Thought.create(body);
        await User.findOneAndUpdate(
          { _id: body.userId},
          { $push: { thoughts: thought._id}},
          { new: true }
        )
        res.json(thought);
      } else {
        res.status(404).json({ message: `No user found with username: ${body.username}`});
      }
    } catch (error) {
      res.json(error);
    }
  },

  // Add thought to user
  // Sample JSON Input:
  // { 
  //   "username": "lernantino",
  //   "thoughtText": "Hiking in the Diamond Heads"
  // }
  // addThought({ body }, res) {
  //   User.exists(
  //     { username: body.username.toLowerCase() }
  //   )
  //     .then(exists => {
  //       if (exists) {
  //         console.log(exists);
  //         Thought.create(body)
  //           .then(dbThoughtData => {
  //             User.findOneAndUpdate(

  //             )
  //             res.json(dbThoughtData)
  //           })

  //           .catch(err => res.json(err)
  //         );
  //       } else {
  //         res.status(404).json({ message: `No user found with username: ${body.username}`})
  //       }
  //     })
  // },

  // Add reaction to thought
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // Remove reaction
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  // Remove thought
  removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.thoughtId })
      .then(deletedThought => {
        if (!deletedThought) {
          return res.status(404).json({ message: 'No thought with this id!' });
        }
        return User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { thoughts: params.thoughtId } },
          { new: true }
        );
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  }
};

module.exports = thoughtController;
