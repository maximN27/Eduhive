const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'professional'],
    default: 'student'
  },
  bio: {
    type: String,
    default: ''
  },
  college: {
    type: String,
    default: ''
  },
  verified: {
    type: Boolean,
    default: false
  },
  profilePic: {
    type: String,
    default: ''
  },
  joinedCommunities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject'
  }],
  streak: {
    type: Number,
    default: 0
  },
  experienceLevel: {
    type: String,
    default: 'Beginner'
  },
  interests: [{
    type: String
  }],
  preferredLanguage: {
    type: String,
    default: 'English'
  },
  preferredResourceType: {
    type: String,
    default: 'All'
  },
  achievementIds: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  savedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  savedResources: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  }],
  customUrl: {
    type: String,
    default: ''
  },
  privacySettings: {
    profileVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'public' },
    activityVisible: { type: Boolean, default: true },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  notificationSettings: {
    emailLikes: { type: Boolean, default: true },
    emailComments: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false }
  },
  appearanceSettings: {
    themeColor: { type: String, default: 'blue' },
    darkMode: { type: Boolean, default: true },
    language: { type: String, default: 'en' }
  },
  gamification: {
    xp: { type: Number, default: 2500 },
    level: { type: Number, default: 5 },
    badges: [{ name: String, icon: String, description: String, dateEarned: Date }],
    certificates: [{ title: String, issuer: String, date: Date, credentialUrl: String }],
    milestones: [{ name: String, target: Number, current: Number, completed: Boolean }]
  },
  savedCollections: [{
    name: { type: String, required: true },
    description: { type: String, default: '' },
    postIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    resourceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }]
  }],
  connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  twoFactorEnabled: { type: Boolean, default: false },
  lastActiveDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
