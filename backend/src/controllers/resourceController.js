const Resource = require('../models/Resource');
const Vote = require('../models/Vote');
const Subject = require('../models/Subject');
const DiscoveryLog = require('../models/DiscoveryLog');
const discoveryService = require('../services/discoveryService');
const mongoose = require('mongoose');

// @desc    Vote on a resource (Convenience endpoint for resources)
// @route   PUT /api/resources/:id/vote
// @access  Private
const voteResource = async (req, res, next) => {
  try {
    const { voteType } = req.body; // 'up' or 'down'

    if (!voteType || !['up', 'down'].includes(voteType)) {
      return res.status(400).json({ success: false, message: 'Invalid voteType. Must be "up" or "down"' });
    }

    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ success: false, message: 'Resource not found' });
    }

    const userId = req.user._id || req.user.userId || req.user.id;
    const existingVote = await Vote.findOne({
      userId,
      targetType: 'Resource',
      targetId: resource._id
    });

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await existingVote.deleteOne();
        resource.votes += voteType === 'up' ? -1 : 1;
      } else {
        existingVote.voteType = voteType;
        await existingVote.save();
        resource.votes += voteType === 'up' ? 2 : -2;
      }
    } else {
      await Vote.create({
        userId,
        targetType: 'Resource',
        targetId: resource._id,
        voteType
      });
      resource.votes += voteType === 'up' ? 1 : -1;
    }

    await resource.save();
    res.status(200).json({ success: true, data: resource, resource });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

// Helper to resolve Subject document from ID or string slug
const findSubject = async (subjectId) => {
  if (!subjectId) return null;

  if (mongoose.Types.ObjectId.isValid(subjectId)) {
    const s = await Subject.findById(subjectId);
    if (s) return s;
  }

  const nameMap = {
    'cs': 'Computer Science',
    'physics': 'Physics',
    'math': 'Mathematics',
    'ee': 'Electrical Engineering',
    'ai': 'Data Science & AI'
  };

  const searchName = nameMap[subjectId.toLowerCase()] || subjectId;
  let subject = await Subject.findOne({ name: new RegExp(`^${searchName}$`, 'i') });
  if (!subject) {
    subject = await Subject.findOne({ name: new RegExp(searchName, 'i') });
  }

  return subject;
};

// @desc    Get resources for a subject with automatic external discovery fan-out
// @route   GET /api/subjects/:id/resources
// @access  Public
const getSubjectResources = async (req, res, next) => {
  try {
    const { id: rawSubjectId } = req.params;
    const { tag, q } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    let subject = await findSubject(rawSubjectId);

    if (!subject) {
      subject = await Subject.findOne() || await Subject.create({ name: 'Computer Science', tags: ['algorithms'] });
    }

    const subjectId = subject._id;

    const queryFilter = { subjectId };
    if (tag) {
      queryFilter.tags = tag.toLowerCase();
    }
    if (q) {
      queryFilter.title = new RegExp(q.trim(), 'i');
    }

    let existingCount = await Resource.countDocuments(queryFilter);

    if (existingCount < 5 && tag) {
      const normalizedTag = tag.toLowerCase().trim();
      const log = await DiscoveryLog.findOne({ subjectId, tag: normalizedTag });

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const shouldRunDiscovery = !log || log.lastRunAt < oneDayAgo;

      if (shouldRunDiscovery) {
        const discoveredItems = await discoveryService.discoverExternalResources(normalizedTag);

        if (discoveredItems.length > 0) {
          const resourceDocs = discoveredItems.map((item) => ({
            ...item,
            subjectId,
            tags: [normalizedTag]
          }));

          await Resource.insertMany(resourceDocs);
        }

        await DiscoveryLog.findOneAndUpdate(
          { subjectId, tag: normalizedTag },
          { lastRunAt: new Date() },
          { upsert: true, new: true }
        );
      }
    }

    let total = await Resource.countDocuments(queryFilter);
    let resources = [];

    if (total === 0 && tag) {
      const tagFilter = { tags: tag.toLowerCase() };
      total = await Resource.countDocuments(tagFilter);
      resources = await Resource.find(tagFilter)
        .sort({ votes: -1, createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit);
    } else {
      resources = await Resource.find(queryFilter)
        .sort({ votes: -1, createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit);
    }

    res.status(200).json({
      success: true,
      resources,
      data: resources,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
        limit
      }
    });
  } catch (error) {
    if (next) next(error);
    else res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  voteResource,
  getSubjectResources
};
