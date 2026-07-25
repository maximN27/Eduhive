const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Vote = require('../models/Vote');
const mongoose = require('mongoose');

// @desc    Get comment by ID
// @route   GET /api/comments/:id
// @access  Public
const getCommentById = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('authorId', 'name username avatar profilePic')
      .populate('mentions', 'name username');

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    res.status(200).json({ success: true, data: comment, comment });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add reply to a parent comment
// @route   POST /api/comments/:id/reply
// @access  Private
const replyToComment = async (req, res, next) => {
  try {
    const { content, mentions } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Reply content is required' });
    }

    const parent = await Comment.findById(req.params.id);
    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent comment not found' });
    }

    if (parent.isDeleted) {
      return res.status(400).json({ success: false, message: 'Cannot reply to a deleted comment' });
    }

    const userId = req.user._id || req.user.userId || req.user.id;
    const reply = await Comment.create({
      postId: parent.postId,
      authorId: userId,
      content,
      parentComment: parent._id,
      mentions: mentions || []
    });

    const populatedReply = await Comment.findById(reply._id)
      .populate('authorId', 'name username avatar profilePic')
      .populate('mentions', 'name username');

    res.status(201).json({ success: true, data: populatedReply, comment: populatedReply });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Author only)
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    const userId = req.user._id || req.user.userId || req.user.id;
    if (comment.authorId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await Vote.deleteMany({ targetType: 'comment', targetId: comment._id });

    const hasReplies = await Comment.exists({ parentComment: comment._id });
    if (hasReplies) {
      comment.content = '[deleted]';
      comment.isDeleted = true;
      await comment.save();
    } else {
      await comment.deleteOne();
    }

    res.status(200).json({ success: true, message: 'Comment removed successfully' });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get flat list of comments for a post
// @route   GET /api/posts/:id/comments
// @access  Public
const getPostComments = async (req, res, next) => {
  try {
    const { id: postId } = req.params;

    const queryIds = [String(postId)];
    if (mongoose.Types.ObjectId.isValid(postId)) {
      queryIds.push(new mongoose.Types.ObjectId(postId));
    }

    const comments = await Comment.find({ postId: { $in: queryIds } })
      .populate('authorId', 'username name avatar profilePic role')
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, count: comments.length, data: comments, comments });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create comment or nested reply for a post
// @route   POST /api/posts/:id/comments
// @access  Private
const createComment = async (req, res, next) => {
  try {
    const { id: postId } = req.params;
    const { content, parentComment, mentions } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        error: { message: 'Comment content is required', code: 'BAD_REQUEST' },
        message: 'Comment content is required'
      });
    }

    let validatedParentId = parentComment || null;
    const userId = req.user._id || req.user.userId || req.user.id;

    const comment = await Comment.create({
      postId: String(postId),
      authorId: userId,
      content,
      parentComment: validatedParentId,
      mentions: mentions || []
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('authorId', 'username name avatar profilePic role');

    res.status(201).json({ success: true, data: populatedComment, comment: populatedComment });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCommentById,
  replyToComment,
  deleteComment,
  getPostComments,
  createComment
};
