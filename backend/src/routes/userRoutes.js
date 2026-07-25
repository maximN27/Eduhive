const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getUserPosts, updateUserSettings, exportUserData } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', getUserProfile);
router.put('/:id', protect, updateUserProfile);
router.get('/:id/posts', getUserPosts);
router.put('/:id/settings', protect, updateUserSettings);
router.get('/:id/export', protect, exportUserData);

module.exports = router;
