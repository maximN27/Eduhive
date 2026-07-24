const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../../src/server');
const connectDB = require('../../src/config/db');
const User = require('../../src/models/User');
const Subject = require('../../src/models/Subject');
const Post = require('../../src/models/Post');
const Comment = require('../../src/models/Comment');
const geminiService = require('../../src/services/geminiService');

let mongoServer;
let token;
let post;

beforeAll(async () => {
  process.env.GEMINI_API_KEY = 'test_dummy_key';
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
  await Post.deleteMany({});
  await Comment.deleteMany({});
  jest.restoreAllMocks();

  const userRes = await request(app).post('/auth/register').send({
    username: 'summarizer',
    name: 'Summarizer User',
    email: 'summary@example.com',
    password: 'password123'
  });
  token = userRes.body.token;

  const subjRes = await request(app)
    .post('/subjects')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'AI & Data Science', description: 'AI discussions' });

  const postRes = await request(app)
    .post('/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({
      subjectId: subjRes.body.subject._id,
      title: 'Difference between L1 and L2 regularization',
      content: 'Can someone explain Lasso vs Ridge regression intuitively?'
    });

  post = postRes.body.post;

  // Add 2 comments
  await request(app)
    .post(`/posts/${post._id}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send({ content: 'L1 causes sparsity by driving coefficients to 0.' });

  await request(app)
    .post(`/posts/${post._id}/comments`)
    .set('Authorization', `Bearer ${token}`)
    .send({ content: 'L2 penalizes large weights proportionally, preserving features.' });
});

describe('Gemini Summarization API Integration Tests', () => {
  it('should call geminiService and return generated summary on first request', async () => {
    const mockSummaryText = 'L1 regularization creates sparse models, while L2 handles multicollinearity by shrinking weights.';
    jest.spyOn(geminiService, 'summarizePost').mockResolvedValue(mockSummaryText);

    const res = await request(app)
      .post(`/posts/${post._id}/summarize`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.summary).toEqual(mockSummaryText);
    expect(res.body.cached).toEqual(false);
    expect(geminiService.summarizePost).toHaveBeenCalledTimes(1);
  });

  it('should return cached summary on second request without invoking Gemini service again', async () => {
    const mockSummaryText = 'Cached summary text of regularization.';
    const spy = jest.spyOn(geminiService, 'summarizePost').mockResolvedValue(mockSummaryText);

    // First call (cache miss)
    await request(app)
      .post(`/posts/${post._id}/summarize`)
      .set('Authorization', `Bearer ${token}`);

    expect(spy).toHaveBeenCalledTimes(1);

    // Second call (cache hit)
    const res2 = await request(app)
      .post(`/posts/${post._id}/summarize`)
      .set('Authorization', `Bearer ${token}`);

    expect(res2.statusCode).toEqual(200);
    expect(res2.body.summary).toEqual(mockSummaryText);
    expect(res2.body.cached).toEqual(true);
    expect(spy).toHaveBeenCalledTimes(1); // Not called a second time
  });

  it('should handle Gemini service errors gracefully with 503 status', async () => {
    jest.spyOn(geminiService, 'summarizePost').mockRejectedValue(new Error('Summary temporarily unavailable'));

    const res = await request(app)
      .post(`/posts/${post._id}/summarize`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(503);
    expect(res.body.error.message).toMatch(/unavailable/i);
  });
});
