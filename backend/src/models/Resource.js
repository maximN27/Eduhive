const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    default: null
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    default: null
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['video', 'pdf', 'github', 'animation', 'research_paper'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }],
  votes: {
    type: Number,
    default: 0
  },
  source: {
    type: String,
    enum: ['user', 'auto'],
    default: 'user'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
