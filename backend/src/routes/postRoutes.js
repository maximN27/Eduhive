const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostResources,
  addPostResource,
  summarizePostHandler
} = require('../controllers/postController');
const {
  getPostComments,
  createComment
} = require('../controllers/commentController');
const protect = require('../middleware/authMiddleware');

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.post('/:id/summarize', protect, summarizePostHandler);

router.route('/:id/comments')
  .get(getPostComments)
  .post(protect, createComment);

router.route('/:id/resources')
  .get(getPostResources)
  .post(protect, addPostResource);

module.exports = router;
