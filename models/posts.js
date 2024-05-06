const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },
    comment: {
      type: String,
      required: [true, 'comment cannot be empty'],
    },
  },
  {
    versionKey: false,
  },
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    author: {
      type: String,
      required: [true, 'author is required'],
    },
    category: {
      type: String,
      enum: ['tech', 'life', 'pets', 'other'],
      default: 'life',
    },
    content: { type: String, required: [true, 'content cannot be empty'] },
    commentCount: { type: Number, default: 0 },
    comments: [commentSchema],
    likes: { type: Number, default: 0 },
    image: String,
  },
  {
    versionKey: false,
  },
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
