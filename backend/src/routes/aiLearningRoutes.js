const express = require('express');
const router = express.Router();
const {
  analyzePost,
  generateLearningPath,
  updateModuleProgress,
  getMentorMatches,
  connectMentor
} = require('../controllers/aiLearningController');
const jwt = require('jsonwebtoken');

// Optional Auth Middleware (allows both authenticated users and guests)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'eduhive_dev_secret_key_12345');
      req.user = decoded;
    } catch (err) {
      // Continue without req.user if token is invalid
    }
  }
  next();
};

router.post('/analyze-post', optionalAuth, analyzePost);
router.post('/generate-path', optionalAuth, generateLearningPath);
router.patch('/paths/:pathId/modules/:stepNumber', optionalAuth, updateModuleProgress);
router.post('/mentor-matches', optionalAuth, getMentorMatches);
router.post('/mentors/connect', optionalAuth, connectMentor);

module.exports = router;
