const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  resourceIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  voteScore: {
    type: Number,
    default: 0
  },
  cachedSummary: {
    type: String,
    default: null
  },
  commentCountAtSummary: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Text index for search functionality
postSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);
