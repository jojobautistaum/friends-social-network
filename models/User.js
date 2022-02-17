const { Schema, model } = require('mongoose');
// const dateFormat = require('../utils/dateFormat');

const UserSchema = new Schema (
  {
    username: {
      type: String,
      required: 'Username is Required',
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: 'Email is Required',
      unique: true,
      match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought'
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
      getters: true
    },
    // Prevents virtuals from creating duplicate _id as 'id'
    id: false 
  }
);

// Get total count of friends
UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});