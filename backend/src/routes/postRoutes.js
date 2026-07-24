const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  summarizePostHandler
} = require('../controllers/postController');
const {
  getPostComments,
  createComment
} = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getPosts);
router.post('/', authMiddleware, createPost);
router.get('/:id', getPostById);
router.put('/:id', authMiddleware, updatePost);
router.delete('/:id', authMiddleware, deletePost);
router.post('/:id/summarize', authMiddleware, summarizePostHandler);

// Comment sub-routes
router.get('/:id/comments', getPostComments);
router.post('/:id/comments', authMiddleware, createComment);

module.exports = router;
