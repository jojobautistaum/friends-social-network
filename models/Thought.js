const { Schema, model, Types } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema (
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId()
    },
    reactionBody: {
      type: String,
      required: "Reaction is Required",
      maxLength: 280
    },
    username: {
      type: String,
      required: "Username is Required"
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);

const ThoughtSchema = new Schema (
  {
    thoughtText: {
      type: String,
      required: "Thought is Required",
      maxLength: 280
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: createdAtVal => dateFormat(createdAtVal)
    },
    username: {
      type: String,
      required: "Username is Required"
    },
    reactions: [ReactionSchema]
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
ThoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});