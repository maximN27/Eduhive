const mongoose = require('mongoose');

const discoveryLogSchema = new mongoose.Schema({
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  tag: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  lastRunAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

discoveryLogSchema.index({ subjectId: 1, tag: 1 }, { unique: true });

module.exports = mongoose.model('DiscoveryLog', discoveryLogSchema);
