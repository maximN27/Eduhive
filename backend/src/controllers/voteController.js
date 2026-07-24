const Vote = require('../models/Vote');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Resource = require('../models/Resource');
const mongoose = require('mongoose');

// @desc    Cast, toggle, or flip vote on post, comment, or resource
// @route   POST /votes
// @access  Private
const castVote = async (req, res, next) => {
  try {
    const { targetType: rawTargetType, targetId, voteType } = req.body;
    const userId = req.user.userId;

    if (!rawTargetType || !targetId || !voteType) {
      return res.status(400).json({
        error: {
          message: 'Please provide targetType, targetId, and voteType',
          code: 'BAD_REQUEST'
        }
      });
    }

    const targetType = rawTargetType.toLowerCase();
    if (!['post', 'comment', 'resource'].includes(targetType)) {
      return res.status(400).json({
        error: {
          message: 'Invalid targetType. Must be post, comment, or resource',
          code: 'BAD_REQUEST'
        }
      });
    }

    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({
        error: {
          message: 'Invalid voteType. Must be up or down',
          code: 'BAD_REQUEST'
        }
      });
    }

    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({
        error: {
          message: 'Invalid targetId',
          code: 'BAD_REQUEST'
        }
      });
    }

    let TargetModel;
    let scoreField = 'voteScore';
    if (targetType === 'post') TargetModel = Post;
    if (targetType === 'comment') TargetModel = Comment;
    if (targetType === 'resource') {
      TargetModel = Resource;
      scoreField = 'votes';
    }

    const targetDoc = await TargetModel.findById(targetId);
    if (!targetDoc) {
      return res.status(404).json({
        error: {
          message: 'Target document not found',
          code: 'NOT_FOUND'
        }
      });
    }

    const existingVote = await Vote.findOne({ userId, targetType, targetId });

    let scoreDelta = 0;
    let userVoteState = null;

    if (!existingVote) {
      // Case 1: First vote
      await Vote.create({ userId, targetType, targetId, voteType });
      scoreDelta = voteType === 'up' ? 1 : -1;
      userVoteState = voteType;
    } else if (existingVote.voteType === voteType) {
      // Case 2: Same vote -> Toggle off (remove vote)
      await Vote.findByIdAndDelete(existingVote._id);
      scoreDelta = voteType === 'up' ? -1 : 1;
      userVoteState = null;
    } else {
      // Case 3: Different vote -> Flip vote
      existingVote.voteType = voteType;
      await existingVote.save();
      scoreDelta = voteType === 'up' ? 2 : -2;
      userVoteState = voteType;
    }

    targetDoc[scoreField] = (targetDoc[scoreField] || 0) + scoreDelta;
    await targetDoc.save();

    res.status(200).json({
      message: 'Vote processed successfully',
      targetType,
      targetId,
      userVoteState,
      voteScore: targetDoc[scoreField]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  castVote
};
