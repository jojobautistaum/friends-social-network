const { User } = require('../models');

const userController = {
  // Get all users
  getAllUser(req, res) {
    User.find({})
      .populate('thoughts')
      .exec(function(err,users) {
        if (err)
      })
      // .select('-__v')
      // .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // Get one user by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // CreateUser
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  // Update user by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id!' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // Delete user
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  // Add friend to a user
  addFriend({ params }, res) {
    // Make sure friendId exist as a user in the DB
    User.exists(
      { _id: params.friendId }
    )
      .then(exists => {
        if (exists) {
          // The user as "friendId" exist, let's add him/her as a friend
          User.findOneAndUpdate(
            { _id: params.userId },
            { $push: { friends: params.friendId } },
            { new: true, runValidators: true }
          )
            .then(dbUserData => {
              if (!dbUserData) {
                res.status(404).json({ message: `No user found with this id ${params.userId}`});
                return;
              }
              res.json(dbUserData);
            })
            .catch(err => res.json(err));
        } else {
          res.status(404).json({ message: `No user found with the friend id ${params.friendId}` });
        }
      }
    )
  },

  // Remove a friend
  deleteFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  }
};

module.exports = userController;