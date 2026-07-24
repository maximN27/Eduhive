const mongoose = require('mongoose');

const mentorMatchSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  targetConcept: {
    type: String,
    required: true
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 85
  },
  matchReason: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['suggested', 'connected', 'dismissed'],
    default: 'suggested'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MentorMatch', mentorMatchSchema);
