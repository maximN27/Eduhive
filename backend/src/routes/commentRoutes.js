const express = require('express');
const router = express.Router();
const { getCommentById, replyToComment, deleteComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', getCommentById);
router.post('/:id/reply', protect, replyToComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
