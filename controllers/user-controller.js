const { User, Thought } = require('../models');

const userController = {
  // Get all users
  async getAllUser(req, res) {
    try {
      const users = await User.find({}).populate({path: 'thoughts', select: '-__v'});
      if (!users) {
        return res.status(404).json({message: "Can't retrieve users!"});
      }
      res.json(users);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  // Get one user by id
  async getUserById({ params }, res) {
    try {
      const user = await User.findOne({ _id: params.id }).populate({path: 'thoughts', select: '-__v'});
      if (!user) {
        return res.status(404).json({message: "Can't find user with this id!"});
      }
      res.json(user);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  // CreateUser
  async createUser({ body }, res) {
    try {
      const user = await User.create(body);
      if(!user) {
        return res.status(404).json({messge: "Can't create the user!"});
      }
      res.json(user);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  // Update user by id
  async updateUser({ params, body }, res) {
    try {
      const user = await User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true });
      if (!user) {
        return res.status(404).json({ message: 'No user found with this id!' });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  // Delete user
  async deleteUser({ params }, res) {
    try {
      const user = await User.findOneAndDelete({ _id: params.id });
      if (user) {
        const thought = await Thought.deleteMany({username: user.username});
        res.json({message: `The user ${user._id} has been removed and the associated thoughts`});
      } else {
        res.status(500).json({ message: 'User does not exist'});
      }
    } catch (error) {
      res.status(400).json(error);
    }
  },

  // Add friend to a user
  async addFriend({ params }, res) {
    try {
      // Make sure friendId exist as a user in the DB
      const userExist = await User.exists({ _id: params.friendId });
      if (!userExist) {
        return res.status(404).json({ message: `No friend user found with this id ${params.friendId}`});
      }
      // Friend user exists
      const user = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true, runValidators: true });
      if (!user){
        return res.status(404).json({ message: `No user found with this id ${params.userId}`});
      }
      res.json(user);
    } catch (error) {
      res.status(400).json(error);
    }
  },

  // Remove a friend
  async deleteFriend({ params }, res) {
    try {
      const friend = await User.findOneAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      );
      if (!friend) {
        return res.status(404).json({message: 'No user found with this id!'});
      }
      res.json({message: `User with id ${params.userId} has been removed as friend!`});
    } catch (error) {
      res.status(400).json(error);
    }
  }
};

module.exports = userController;