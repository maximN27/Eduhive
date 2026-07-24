const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['video', 'PDF', 'GitHub', 'Animation', 'Research Paper'],
    required: true
  },
  URL: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  votes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resource', resourceSchema);
