const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostComments,
  addPostComment,
  getPostResources,
  addPostResource
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

router.route('/:id/comments')
  .get(getPostComments)
  .post(protect, addPostComment);

router.route('/:id/resources')
  .get(getPostResources)
  .post(protect, addPostResource);

module.exports = router;
