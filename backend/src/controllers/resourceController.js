const Resource = require('../models/Resource');
const Vote = require('../models/Vote');

// @desc    Vote on a resource (Convenience endpoint for resources)
// @route   PUT /api/resources/:id/vote
// @access  Private
exports.voteResource = async (req, res) => {
  try {
    const { voteType } = req.body; // 'up' or 'down'

    if (!voteType || !['up', 'down'].includes(voteType)) {
      return res.status(400).json({ success: false, message: 'Invalid voteType. Must be "up" or "down"' });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const existingVote = await Vote.findOne({
      userId: req.user._id,
      targetType: 'Resource',
      targetId: resource._id
    });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // Toggle off vote if clicked same direction
        await existingVote.deleteOne();
        resource.votes += voteType === 'up' ? -1 : 1;
      } else {
        // Change vote direction
        existingVote.voteType = voteType;
        await existingVote.save();
        resource.votes += voteType === 'up' ? 2 : -2;
      }
    } else {
      // Create new vote
      await Vote.create({
        userId: req.user._id,
        targetType: 'Resource',
        targetId: resource._id,
        voteType
      });
      resource.votes += voteType === 'up' ? 1 : -1;
    }

    await resource.save();

    res.status(200).json({ success: true, data: resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
