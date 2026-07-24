const mongoose = require('mongoose');

const moduleStepSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  estimatedMinutes: {
    type: Number,
    default: 15
  },
  concept: {
    type: String,
    default: ''
  },
  resources: [{
    title: String,
    url: String,
    type: { type: String, default: 'Article' }
  }],
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
});

const learningPathSchema = new mongoose.Schema({
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
  gapId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KnowledgeGap'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  targetConcept: {
    type: String,
    required: true
  },
  overallProgress: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  modules: [moduleStepSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('LearningPath', learningPathSchema);
