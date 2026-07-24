const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'eduhive_dev_secret_key_12345';
      const decoded = jwt.verify(token, secret);

      const userId = decoded.id || decoded.userId;
      const user = await User.findById(userId).select('-passwordHash');

      if (!user) {
        return res.status(401).json({
          success: false,
          error: { message: 'User not found', code: 'UNAUTHORIZED' },
          message: 'User not found'
        });
      }

      req.user = user;
      req.user.userId = user._id.toString();
      req.user.role = decoded.role || user.role;
      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: { message: 'Not authorized, token failed', code: 'UNAUTHORIZED' },
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { message: 'No authorization token provided', code: 'UNAUTHORIZED' },
      message: 'No authorization token provided'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'eduhive_dev_secret_key_12345';
      const decoded = jwt.verify(token, secret);
      const userId = decoded.id || decoded.userId;
      const user = await User.findById(userId).select('-passwordHash');
      if (user) {
        req.user = user;
        req.user.userId = user._id.toString();
      }
    } catch (error) {
      // Ignore token validation failure for optional auth
    }
  }
  next();
};

module.exports = protect;
module.exports.protect = protect;
module.exports.optionalAuth = optionalAuth;
