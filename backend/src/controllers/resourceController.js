const Resource = require('../models/Resource');
const Subject = require('../models/Subject');
const DiscoveryLog = require('../models/DiscoveryLog');
const discoveryService = require('../services/discoveryService');
const mongoose = require('mongoose');

// Helper to resolve Subject document from ID or string slug
const findSubject = async (subjectId) => {
  if (!subjectId) return null;

  if (mongoose.Types.ObjectId.isValid(subjectId)) {
    const s = await Subject.findById(subjectId);
    if (s) return s;
  }

  // Fallback map for common string codes/slugs
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
// @route   GET /subjects/:id/resources
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

    // Auto-discovery trigger: < 5 cached items and tag provided
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
      resources,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit) || 1,
        limit
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubjectResources
};
