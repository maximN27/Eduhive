const mongoose = require('mongoose');

const knowledgeGapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  subjectId: {
    type: String,
    default: 'general'
  },
  conceptTag: {
    type: String,
    required: true,
    trim: true
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 75
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  evidence: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['detected', 'in_progress', 'resolved'],
    default: 'detected'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('KnowledgeGap', knowledgeGapSchema);
