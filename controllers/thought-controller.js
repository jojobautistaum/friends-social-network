const { json } = require('express/lib/response');
const res = require('express/lib/response');
const { Thought, User } = require('../models');

const thoughtController = {
  async getAllThought(req, res) {
    try {
      const thoughts = await Thought.find({}).sort({_id: -1});
      if (thoughts) {
        res.json(thoughts);
      } else {
        res.status(500)>json({message: 'Something went wrong!'});
      }
    } catch (error) {
      res.status(400).json(error);
    }
  },

  async addThought({ body }, res) {
    try {
      const user = await User.exists({ username: body.username.toLowerCase() });
      if (user) {
        const thought = await Thought.create(body);
        await User.findOneAndUpdate(
          { username: body.username.toLowerCase()},
          { $push: { thoughts: thought._id}},
          { new: true }
        )
        res.json(thought);
      } else {
        res.status(404).json({ message: `No user found with username: ${body.username}`});
      }
    } catch (error) {
      res.json('error');
    }
  },

  // Add reaction to thought
  async addReaction({ params, body }, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      )
      if (thought) {
        res.json(thought);
      } else {
        res.status(404).json ({ message: 'No user found with this id!'});
      }
    } catch (error) {
      res.json(error);
    }
  },

  // Remove reaction
  async removeReaction({ params }, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      )
      if (thought) {
        res.json({ message: 'Reaction has been deleted'});
      } else {
        res.status(500).json({ message: "Can't find the reaction id"});
      }
    } catch (error) {
      res.json(error);
    }
  },

  // Remove thought
  async removeThought({ params }, res) {
    try {
      const deletedThought = await Thought.findOneAndDelete({ _id: params.thoughtId });
      if (!deletedThought) {
        return res.status(404).json({ messge: 'No thougth with this id!'});
      }
      await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { thoughts: params.thoughtId } },
        { new: true }
      );
      res.json({message: 'Thought has been deleted!'});
    } catch (error) {
      res.json(error);
    }
  }
};

module.exports = thoughtController;
