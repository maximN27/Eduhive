const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../../src/server');
const connectDB = require('../../src/config/db');
const User = require('../../src/models/User');
const Subject = require('../../src/models/Subject');
const Resource = require('../../src/models/Resource');
const DiscoveryLog = require('../../src/models/DiscoveryLog');
const discoveryService = require('../../src/services/discoveryService');

let mongoServer;
let token;
let subject;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await connectDB(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await User.deleteMany({});
  await Subject.deleteMany({});
  await Resource.deleteMany({});
  await DiscoveryLog.deleteMany({});
  jest.restoreAllMocks();

  const userRes = await request(app).post('/auth/register').send({
    username: 'discoverer',
    name: 'Discoverer User',
    email: 'discover@example.com',
    password: 'password123'
  });
  token = userRes.body.token;

  const subjRes = await request(app)
    .post('/subjects')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Algorithms & Data Structures', description: 'DSA Subject' });

  subject = subjRes.body.subject;
});

describe('External Resource Discovery Integration Tests', () => {
  it('should trigger discovery fan-out when fewer than 5 cached resources exist for a tag', async () => {
    const mockDiscovered = [
      { title: 'YouTube Algo Video', url: 'https://youtube.com/watch?v=123', thumbnail: 'thumb.jpg', type: 'video', source: 'auto' },
      { title: 'GitHub Algo Repo', url: 'https://github.com/algo/repo', thumbnail: 'avatar.png', type: 'github', source: 'auto' },
      { title: 'arXiv Paper', url: 'https://arxiv.org/abs/1234', thumbnail: '', type: 'research_paper', source: 'auto' }
    ];

    const spy = jest.spyOn(discoveryService, 'discoverExternalResources').mockResolvedValue(mockDiscovered);

    const res = await request(app).get(`/subjects/${subject._id}/resources?tag=algorithms`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.resources.length).toBeGreaterThanOrEqual(3);
    expect(spy).toHaveBeenCalledWith('algorithms');

    // Verify DiscoveryLog document created
    const log = await DiscoveryLog.findOne({ subjectId: subject._id, tag: 'algorithms' });
    expect(log).toBeDefined();
  });

  it('should return cached results without triggering discovery when >=5 items exist for tag', async () => {
    const mockItems = [];
    for (let i = 1; i <= 5; i++) {
      mockItems.push({
        subjectId: subject._id,
        title: `Resource #${i}`,
        type: 'video',
        url: `https://example.com/${i}`,
        tags: ['algorithms'],
        source: 'user'
      });
    }
    await Resource.insertMany(mockItems);

    const spy = jest.spyOn(discoveryService, 'discoverExternalResources');

    const res = await request(app).get(`/subjects/${subject._id}/resources?tag=algorithms`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.resources.length).toEqual(5);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should not re-trigger discovery within the same day even if <5 items exist', async () => {
    // Create a DiscoveryLog run 1 hour ago
    await DiscoveryLog.create({
      subjectId: subject._id,
      tag: 'algorithms',
      lastRunAt: new Date(Date.now() - 60 * 60 * 1000)
    });

    const spy = jest.spyOn(discoveryService, 'discoverExternalResources');

    const res = await request(app).get(`/subjects/${subject._id}/resources?tag=algorithms`);

    expect(res.statusCode).toEqual(200);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should normalize discovery output and handle single service failure gracefully via Promise.allSettled', async () => {
    jest.spyOn(discoveryService, 'fetchYoutube').mockResolvedValue([
      { title: 'Video 1', url: 'https://youtube.com/v1', thumbnail: 't1', type: 'video', source: 'auto' }
    ]);
    jest.spyOn(discoveryService, 'fetchGithub').mockResolvedValue([
      { title: 'Repo 1', url: 'https://github.com/r1', thumbnail: 'a1', type: 'github', source: 'auto' }
    ]);
    jest.spyOn(discoveryService, 'fetchArxiv').mockRejectedValue(new Error('arXiv Timeout'));

    const discovered = await discoveryService.discoverExternalResources('algorithms');

    expect(discovered.length).toEqual(2); // YouTube (1) + GitHub (1) returned, arXiv error rejected cleanly
    expect(discovered[0].source).toEqual('auto');
  });
});
