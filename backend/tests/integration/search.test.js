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
    username: 'searcher',
    name: 'Searcher User',
    email: 'searcher@example.com',
    password: 'password123'
  });
  token = userRes.body.token;

  const subjRes = await request(app)
    .post('/subjects')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Computer Architecture', description: 'Hardware & OS' });

  await request(app)
    .post('/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({
      subjectId: subjRes.body.subject._id,
      title: 'Pipelining hazards in RISC-V',
      content: 'Explaining data hazards and control hazards in CPU pipeline.',
      tags: ['riscv', 'cpu', 'pipeline']
    });

  await request(app)
    .post('/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({
      subjectId: subjRes.body.subject._id,
      title: 'Virtual memory and page tables',
      content: 'How TLB caching speeds up virtual address translation.',
      tags: ['os', 'memory', 'tlb']
    });
});

describe('Search Integration Tests', () => {
  it('should return matching posts when query matches title, content, or tags', async () => {
    const res = await request(app).get('/search?q=pipeline&type=posts');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).toBeGreaterThan(0);
    expect(res.body.results[0].title).toMatch(/pipelining/i);
  });

  it('should return empty array (not error) when nothing matches', async () => {
    const res = await request(app).get('/search?q=xyznonexistentterm123&type=posts');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results).toEqual([]);
    expect(res.body.count).toEqual(0);
  });
});
