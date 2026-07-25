const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../../src/server');
const connectDB = require('../../src/config/db');
const User = require('../../src/models/User');
const Subject = require('../../src/models/Subject');
const Post = require('../../src/models/Post');
const Vote = require('../../src/models/Vote');

let mongoServer;
let token;
let user;
let post;

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
  await Vote.deleteMany({});

  const userRes = await request(app).post('/auth/register').send({
    username: 'voter1',
    name: 'Voter User',
    email: 'voter@example.com',
    password: 'password123'
  });
  token = userRes.body.token;
  user = userRes.body.user;

  const subjRes = await request(app)
    .post('/subjects')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Physics', description: 'Physics subject' });

  const postRes = await request(app)
    .post('/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({
      subjectId: subjRes.body.subject._id,
      title: 'Quantum Entanglement',
      content: 'Can someone explain EPR paradox?'
    });

  post = postRes.body.post;
});

describe('Voting Integration Tests', () => {
  it('should process first vote (+1), same vote toggle off (-1), and flip vote (shift by 2)', async () => {
    // 1. First Upvote: score 0 -> 1
    const vote1 = await request(app)
      .post('/votes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        targetType: 'post',
        targetId: post._id,
        voteType: 'up'
      });

    expect(vote1.statusCode).toEqual(200);
    expect(vote1.body.userVoteState).toEqual('up');
    expect(vote1.body.voteScore).toEqual(1);

    // 2. Same Upvote again: Toggle off -> score 1 -> 0
    const vote2 = await request(app)
      .post('/votes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        targetType: 'post',
        targetId: post._id,
        voteType: 'up'
      });

    expect(vote2.statusCode).toEqual(200);
    expect(vote2.body.userVoteState).toBeNull();
    expect(vote2.body.voteScore).toEqual(0);

    // 3. Upvote again: score 0 -> 1
    await request(app)
      .post('/votes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        targetType: 'post',
        targetId: post._id,
        voteType: 'up'
      });

    // 4. Downvote after Upvote: Flip vote -> score 1 -> -1 (shift by 2)
    const vote3 = await request(app)
      .post('/votes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        targetType: 'post',
        targetId: post._id,
        voteType: 'down'
      });

    expect(vote3.statusCode).toEqual(200);
    expect(vote3.body.userVoteState).toEqual('down');
    expect(vote3.body.voteScore).toEqual(-1);
  });

  it('should enforce unique index constraint on duplicate vote documents', async () => {
    // Ensure index is created in test DB
    await Vote.syncIndexes();

    await Vote.create({
      userId: user._id,
      targetType: 'post',
      targetId: post._id,
      voteType: 'up'
    });

    let duplicateError;
    try {
      await Vote.create({
        userId: user._id,
        targetType: 'post',
        targetId: post._id,
        voteType: 'up'
      });
    } catch (err) {
      duplicateError = err;
    }

    expect(duplicateError).toBeDefined();
    expect(duplicateError.code).toEqual(11000); // Mongo Duplicate Key error code
  });
});
