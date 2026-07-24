const Comment = require('../models/Comment');
const Post = require('../models/Post');
const mongoose = require('mongoose');

// @desc    Get flat list of comments for a post
// @route   GET /posts/:id/comments
// @access  Public
const getPostComments = async (req, res, next) => {
  try {
    const { id: postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          code: 'NOT_FOUND'
        }
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          code: 'NOT_FOUND'
        }
      });
    }

    const comments = await Comment.find({ postId })
      .populate('authorId', 'username name profilePic role')
      .sort({ createdAt: 1 });

    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Create comment or nested reply for a post
// @route   POST /posts/:id/comments
// @access  Private
const createComment = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const { content, parentComment, mentions } = req.body;

    if (!content) {
      return res.status(400).json({
        error: {
          message: 'Comment content is required',
          code: 'BAD_REQUEST'
        }
      });
    }

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          code: 'NOT_FOUND'
        }
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        error: {
          message: 'Post not found',
          code: 'NOT_FOUND'
        }
      });
    }

    if (parentComment) {
      if (!mongoose.Types.ObjectId.isValid(parentComment)) {
        return res.status(400).json({
          error: {
            message: 'Invalid parentComment ID',
            code: 'BAD_REQUEST'
          }
        });
      }

      const parent = await Comment.findById(parentComment);
      if (!parent) {
        return res.status(400).json({
          error: {
            message: 'Parent comment not found',
            code: 'BAD_REQUEST'
          }
        });
      }

      if (parent.postId.toString() !== postId) {
        return res.status(400).json({
          error: {
            message: 'Parent comment belongs to a different post',
            code: 'BAD_REQUEST'
          }
        });
      }
    }

    const comment = await Comment.create({
      postId,
      authorId: req.user.userId,
      content,
      parentComment: parentComment || null,
      mentions: mentions || []
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('authorId', 'username name profilePic role');

    res.status(201).json({ comment: populatedComment });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPostComments,
  createComment
};
