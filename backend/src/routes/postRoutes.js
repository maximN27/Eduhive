const express = require('express');
const router = express.Router();
const {
  getPosts,
  createPost,
  upvotePost,
  toggleSavePost,
  addComment
} = require('../controllers/postController');

router.get('/', getPosts);
router.post('/', createPost);
router.put('/:id/upvote', upvotePost);
router.put('/:id/save', toggleSavePost);
router.post('/:id/comments', addComment);

module.exports = router;
