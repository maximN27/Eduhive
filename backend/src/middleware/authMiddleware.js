const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        message: 'No authorization token provided',
        code: 'UNAUTHORIZED'
      }
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'eduhive_dev_secret_key_12345');
    req.user = decoded; // Contains { userId, role }
    next();
  } catch (error) {
    return res.status(401).json({
      error: {
        message: 'Invalid or expired token',
        code: 'UNAUTHORIZED'
      }
    });
  }
};

module.exports = authMiddleware;
