const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-passwordHash')
      .populate('joinedCommunities', 'name description tags membersCount');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private (Owner only)
exports.updateUserProfile = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this profile' });
    }

    const allowedUpdates = [
      'name', 'bio', 'college', 'profilePic', 'experienceLevel',
      'interests', 'preferedLanguage', 'preferedResourceType', 'streak'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).select('-passwordHash');

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all posts created by a specific user
// @route   GET /api/users/:id/posts
// @access  Public
exports.getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ authorId: req.params.id })
      .populate('subjectId', 'name description')
      .populate('authorId', 'name username avatar profilePic')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user preferences & settings (privacy, notifications, appearance)
// @route   PUT /api/users/:id/settings
// @access  Private (Owner only)
exports.updateUserSettings = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    if (userId.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update settings' });
    }

    const { privacySettings, notificationSettings, appearanceSettings, customUrl } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (privacySettings) user.privacySettings = { ...user.privacySettings, ...privacySettings };
    if (notificationSettings) user.notificationSettings = { ...user.notificationSettings, ...notificationSettings };
    if (appearanceSettings) user.appearanceSettings = { ...user.appearanceSettings, ...appearanceSettings };
    if (customUrl !== undefined) user.customUrl = customUrl;

    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export user personal data
// @route   GET /api/users/:id/export
// @access  Private (Owner only)
exports.exportUserData = async (req, res) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    if (userId.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to export data' });
    }

    const user = await User.findById(req.params.id).select('-passwordHash');
    const posts = await Post.find({ authorId: req.params.id });

    res.status(200).json({
      success: true,
      exportedAt: new Date(),
      user,
      postsCount: posts.length,
      posts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
