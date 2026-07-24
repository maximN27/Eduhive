const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, userId, role },
    process.env.JWT_SECRET || 'eduhive_dev_secret_key_12345',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { username, name, email, password, role, bio, college, profilePic, experienceLevel, interests, preferredLanguage, preferredResourceType } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Please provide username, name, email, and password',
          code: 'BAD_REQUEST'
        },
        message: 'Please provide username, name, email, and password'
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'User with this email or username already exists',
          code: 'CONFLICT'
        },
        message: 'User with this email or username already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'Student',
      bio: bio || '',
      college: college || '',
      profilePic: profilePic || '',
      experienceLevel: experienceLevel || 'Beginner',
      interests: interests || [],
      preferredLanguage: preferredLanguage || 'English',
      preferredResourceType: preferredResourceType || 'All'
    });

    const token = generateToken(user._id, user.role);
    const userResponse = await User.findById(user._id).select('-passwordHash');

    res.status(201).json({
      success: true,
      token,
      user: userResponse,
      data: userResponse
    });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Please provide email and password',
          code: 'BAD_REQUEST'
        },
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid credentials',
          code: 'UNAUTHORIZED'
        },
        message: 'Invalid credentials'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Invalid credentials',
          code: 'UNAUTHORIZED'
        },
        message: 'Invalid credentials'
      });
    }

    user.lastActiveDate = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);
    const userResponse = await User.findById(user._id).select('-passwordHash');

    res.status(200).json({
      success: true,
      token,
      user: userResponse,
      data: userResponse
    });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.userId || req.user.id;
    const user = await User.findById(userId)
      .select('-passwordHash')
      .populate('joinedCommunities', 'name description tags membersCount')
      .populate('savedPosts', 'title voteScore createdAt')
      .populate('savedResources', 'title type URL');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'User not found',
          code: 'NOT_FOUND'
        },
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user,
      data: user
    });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.status(200).json({ success: true, message: 'Successfully logged out' });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  register: registerUser,
  login: loginUser,
  logout: logoutUser
};
