const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  count: { type: Number, default: 0 }
});

const subjectSchema = new mongoose.Schema({
  subjectId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  count: { type: Number, default: 0 },
  description: { type: String },
  subtopics: [tagSchema]
});

module.exports = mongoose.model('Subject', subjectSchema);
