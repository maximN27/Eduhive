const Vote = require('../models/Vote');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Resource = require('../models/Resource');

// @desc    Unified voting endpoint for Post, Comment, or Resource
// @route   POST /api/votes
// @access  Private
exports.castVote = async (req, res) => {
  try {
    const { targetType, targetId, voteType } = req.body;

    if (!targetType || !targetId || !voteType) {
      return res.status(400).json({ success: false, message: 'Please provide targetType, targetId, and voteType' });
    }

    if (!['Post', 'Comment', 'Resource'].includes(targetType)) {
      return res.status(400).json({ success: false, message: 'Invalid targetType. Must be Post, Comment, or Resource' });
    }

    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({ success: false, message: 'Invalid voteType. Must be "up" or "down"' });
    }

    // Find Target Document
    let TargetModel;
    if (targetType === 'Post') TargetModel = Post;
    else if (targetType === 'Comment') TargetModel = Comment;
    else if (targetType === 'Resource') TargetModel = Resource;

    const targetDoc = await TargetModel.findById(targetId);
    if (!targetDoc) {
      return res.status(404).json({ success: false, message: `${targetType} not found` });
    }

    const existingVote = await Vote.findOne({
      userId: req.user._id,
      targetType,
      targetId
    });

    let scoreField = targetType === 'Resource' ? 'votes' : 'voteScore';
    let delta = 0;

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Toggle off existing vote
        await existingVote.deleteOne();
        delta = voteType === 'up' ? -1 : 1;
      } else {
        // Switch vote direction
        existingVote.voteType = voteType;
        await existingVote.save();
        delta = voteType === 'up' ? 2 : -2;
      }
    } else {
      // Cast new vote
      await Vote.create({
        userId: req.user._id,
        targetType,
        targetId,
        voteType
      });
      delta = voteType === 'up' ? 1 : -1;
    }

    targetDoc[scoreField] = (targetDoc[scoreField] || 0) + delta;
    await targetDoc.save();

    res.status(200).json({
      success: true,
      data: {
        targetType,
        targetId,
        newScore: targetDoc[scoreField]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
