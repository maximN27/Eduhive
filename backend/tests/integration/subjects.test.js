const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../../src/server');
const connectDB = require('../../src/config/db');
const User = require('../../src/models/User');
const Subject = require('../../src/models/Subject');
const Post = require('../../src/models/Post');

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
  await Post.deleteMany({});

  const userRes = await request(app).post('/auth/register').send({
    username: 'paginator',
    name: 'Paginator User',
    email: 'page@example.com',
    password: 'password123'
  });
  token = userRes.body.token;

  const subjRes = await request(app)
    .post('/subjects')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Mathematics',
      description: 'Math subject'
    });
  subject = subjRes.body.subject;

  // Seed 25 posts
  const postsToSeed = [];
  for (let i = 1; i <= 25; i++) {
    postsToSeed.push({
      subjectId: subject._id,
      authorId: userRes.body.user._id,
      title: `Math Question #${i}`,
      content: `Question content ${i}`
    });
  }
  await Post.insertMany(postsToSeed);
});

describe('Subjects Integration Tests', () => {
  it('should paginate GET /subjects/:id/posts correctly (page 2 returns different results than page 1)', async () => {
    const page1Res = await request(app).get(`/subjects/${subject._id}/posts?page=1&limit=10`);
    expect(page1Res.statusCode).toEqual(200);
    expect(page1Res.body.posts.length).toEqual(10);
    expect(page1Res.body.pagination.total).toEqual(25);
    expect(page1Res.body.pagination.pages).toEqual(3);

    const page2Res = await request(app).get(`/subjects/${subject._id}/posts?page=2&limit=10`);
    expect(page2Res.statusCode).toEqual(200);
    expect(page2Res.body.posts.length).toEqual(10);

    const page1Titles = page1Res.body.posts.map(p => p.title);
    const page2Titles = page2Res.body.posts.map(p => p.title);

    // Ensure page 1 and page 2 have non-overlapping posts
    const intersection = page1Titles.filter(title => page2Titles.includes(title));
    expect(intersection.length).toEqual(0);
  });
});
