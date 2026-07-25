const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUserPosts } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.get('/:id/posts', getUserPosts);

module.exports = router;
