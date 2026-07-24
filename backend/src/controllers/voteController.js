const Vote = require('../models/Vote');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Resource = require('../models/Resource');
const mongoose = require('mongoose');

// @desc    Cast, toggle, or flip vote on post, comment, or resource
// @route   POST /api/votes
// @access  Private
const castVote = async (req, res, next) => {
  try {
    const { targetType: rawTargetType, targetId, voteType } = req.body;
    const userId = req.user._id || req.user.userId || req.user.id;

    if (!rawTargetType || !targetId || !voteType) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide targetType, targetId, and voteType', code: 'BAD_REQUEST' },
        message: 'Please provide targetType, targetId, and voteType'
      });
    }

    const normalizedTarget = rawTargetType.charAt(0).toUpperCase() + rawTargetType.slice(1).toLowerCase();
    if (!['Post', 'Comment', 'Resource'].includes(normalizedTarget)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid targetType. Must be Post, Comment, or Resource', code: 'BAD_REQUEST' },
        message: 'Invalid targetType. Must be Post, Comment, or Resource'
      });
    }

    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid voteType. Must be up or down', code: 'BAD_REQUEST' },
        message: 'Invalid voteType. Must be up or down'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid targetId', code: 'BAD_REQUEST' },
        message: 'Invalid targetId'
      });
    }

    let TargetModel;
    let scoreField = 'voteScore';
    if (normalizedTarget === 'Post') TargetModel = Post;
    if (normalizedTarget === 'Comment') TargetModel = Comment;
    if (normalizedTarget === 'Resource') {
      TargetModel = Resource;
      scoreField = 'votes';
    }

    const targetDoc = await TargetModel.findById(targetId);
    if (!targetDoc) {
      return res.status(404).json({
        success: false,
        error: { message: 'Target document not found', code: 'NOT_FOUND' },
        message: 'Target document not found'
      });
    }

    const existingVote = await Vote.findOne({
      userId,
      $or: [{ targetType: normalizedTarget }, { targetType: rawTargetType.toLowerCase() }],
      targetId
    });

    let scoreDelta = 0;
    let userVoteState = null;

    if (!existingVote) {
      await Vote.create({ userId, targetType: normalizedTarget, targetId, voteType });
      scoreDelta = voteType === 'up' ? 1 : -1;
      userVoteState = voteType;
    } else if (existingVote.voteType === voteType) {
      await Vote.findByIdAndDelete(existingVote._id);
      scoreDelta = voteType === 'up' ? -1 : 1;
      userVoteState = null;
    } else {
      existingVote.voteType = voteType;
      await existingVote.save();
      scoreDelta = voteType === 'up' ? 2 : -2;
      userVoteState = voteType;
    }

    targetDoc[scoreField] = (targetDoc[scoreField] || 0) + scoreDelta;
    await targetDoc.save();

    res.status(200).json({
      success: true,
      message: 'Vote processed successfully',
      targetType: normalizedTarget,
      targetId,
      userVoteState,
      newScore: targetDoc[scoreField],
      voteScore: targetDoc[scoreField],
      data: {
        targetType: normalizedTarget,
        targetId,
        newScore: targetDoc[scoreField]
      }
    });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  castVote
};
