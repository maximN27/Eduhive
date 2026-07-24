const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true },
  avatar: { type: String },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  author: {
    name: { type: String, required: true },
    handle: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, default: 'Scholar' }
  },
  subjectId: { type: String, required: true },
  subjectName: { type: String, required: true },
  tags: [{ type: String }],
  title: { type: String, required: true },
  content: { type: String, required: true },
  codeSnippet: { type: String, default: '' },
  upvotes: { type: Number, default: 0 },
  saved: { type: Boolean, default: false },
  comments: [commentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
