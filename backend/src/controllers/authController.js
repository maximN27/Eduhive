const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET || 'eduhive_dev_secret_key_12345',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user
// @route   POST /auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { username, name, email, password, role, bio, college, experienceLevel, interests, preferredLanguage, preferredResourceType } = req.body;

    if (!username || !name || !email || !password) {
      return res.status(400).json({
        error: {
          message: 'Please provide username, name, email, and password',
          code: 'BAD_REQUEST'
        }
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({
        error: {
          message: 'User with this email or username already exists',
          code: 'CONFLICT'
        }
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'student',
      bio: bio || '',
      college: college || '',
      experienceLevel: experienceLevel || 'Beginner',
      interests: interests || [],
      preferredLanguage: preferredLanguage || 'English',
      preferredResourceType: preferredResourceType || 'All'
    });

    const token = generateToken(user._id, user.role);

    const userResponse = await User.findById(user._id).select('-passwordHash');

    res.status(201).json({
      token,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: {
          message: 'Please provide email and password',
          code: 'BAD_REQUEST'
        }
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          code: 'UNAUTHORIZED'
        }
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          code: 'UNAUTHORIZED'
        }
      });
    }

    user.lastActiveDate = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);
    const userResponse = await User.findById(user._id).select('-passwordHash');

    res.status(200).json({
      token,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        error: {
          message: 'User not found',
          code: 'NOT_FOUND'
        }
      });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (discard client token)
// @route   POST /auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  logoutUser
};
