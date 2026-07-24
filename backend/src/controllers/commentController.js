const Comment = require('../models/Comment');

// @desc    Get comment by ID
// @route   GET /api/comments/:id
// @access  Public
exports.getCommentById = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('authorId', 'name username avatar profilePic')
      .populate('mentions', 'name username');

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    res.status(200).json({ success: true, data: comment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add reply to a parent comment
// @route   POST /api/comments/:id/reply
// @access  Private
exports.replyToComment = async (req, res) => {
  try {
    const { content, mentions } = req.body;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Reply content is required' });
    }

    const parent = await Comment.findById(req.params.id);
    if (!parent) {
      return res.status(404).json({ success: false, message: 'Parent comment not found' });
    }

    const reply = await Comment.create({
      postId: parent.postId,
      authorId: req.user._id,
      content,
      parentComment: parent._id,
      mentions: mentions || []
    });

    const populatedReply = await Comment.findById(reply._id)
      .populate('authorId', 'name username avatar profilePic')
      .populate('mentions', 'name username');

    res.status(201).json({ success: true, data: populatedReply });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private (Author only)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    if (comment.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, message: 'Comment removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
