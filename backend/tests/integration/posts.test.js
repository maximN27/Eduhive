const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../../src/server');
const connectDB = require('../../src/config/db');
const User = require('../../src/models/User');
const Subject = require('../../src/models/Subject');
const Post = require('../../src/models/Post');
const Comment = require('../../src/models/Comment');

let mongoServer;
let authorToken;
let authorUser;
let otherToken;
let otherUser;
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
  await Comment.deleteMany({});

  // Register Author
  const authorRes = await request(app).post('/auth/register').send({
    username: 'author1',
    name: 'Author User',
    email: 'author@example.com',
    password: 'password123'
  });
  authorToken = authorRes.body.token;
  authorUser = authorRes.body.user;

  // Register Other User
  const otherRes = await request(app).post('/auth/register').send({
    username: 'other1',
    name: 'Other User',
    email: 'other@example.com',
    password: 'password123'
  });
  otherToken = otherRes.body.token;
  otherUser = otherRes.body.user;

  // Create Subject
  const subjRes = await request(app)
    .post('/subjects')
    .set('Authorization', `Bearer ${authorToken}`)
    .send({
      name: 'Computer Science',
      description: 'CS discussions',
      tags: ['cs', 'programming']
    });
  subject = subjRes.body.subject;
});

describe('Posts & Comments Integration Tests', () => {
  describe('POST /posts', () => {
    it('should succeed when authenticated with valid subjectId', async () => {
      const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          subjectId: subject._id,
          title: 'What is recursion?',
          content: 'Can someone explain recursion simply?',
          tags: ['recursion', 'cs']
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body.post.title).toEqual('What is recursion?');
      expect(res.body.post.authorId.username).toEqual(authorUser.username);
    });

    it('should return 401 when not authenticated', async () => {
      const res = await request(app)
        .post('/posts')
        .send({
          subjectId: subject._id,
          title: 'Unauthenticated post',
          content: 'Test content'
        });

      expect(res.statusCode).toEqual(401);
    });

    it('should return 400 when subjectId does not exist', async () => {
      const fakeSubjectId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          subjectId: fakeSubjectId,
          title: 'Test Title',
          content: 'Test Content'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error.message).toMatch(/subject/i);
    });
  });

  describe('GET /posts/:id', () => {
    it('should return populated author info', async () => {
      const postRes = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          subjectId: subject._id,
          title: 'Sample Post',
          content: 'Sample Content'
        });

      const res = await request(app).get(`/posts/${postRes.body.post._id}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.post).toHaveProperty('authorId');
      expect(res.body.post.authorId.username).toEqual(authorUser.username);
    });

    it('should return 404 for nonexistent post id', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/posts/${fakeId}`);
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('PUT & DELETE /posts/:id (Author Authorization)', () => {
    let post;

    beforeEach(async () => {
      const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          subjectId: subject._id,
          title: 'Author Post',
          content: 'Original content'
        });
      post = res.body.post;
    });

    it('should allow author to update post', async () => {
      const res = await request(app)
        .put(`/posts/${post._id}`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send({ title: 'Updated Title' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.post.title).toEqual('Updated Title');
    });

    it('should return 403 when a non-author tries to update post', async () => {
      const res = await request(app)
        .put(`/posts/${post._id}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ title: 'Hacked Title' });

      expect(res.statusCode).toEqual(403);
    });

    it('should return 403 when a non-author tries to delete post', async () => {
      const res = await request(app)
        .delete(`/posts/${post._id}`)
        .set('Authorization', `Bearer ${otherToken}`);

      expect(res.statusCode).toEqual(403);
    });

    it('should allow author to delete post', async () => {
      const res = await request(app)
        .delete(`/posts/${post._id}`)
        .set('Authorization', `Bearer ${authorToken}`);

      expect(res.statusCode).toEqual(200);
    });
  });

  describe('POST /posts/:id/comments', () => {
    let post;

    beforeEach(async () => {
      const res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          subjectId: subject._id,
          title: 'Question Post',
          content: 'Question Content'
        });
      post = res.body.post;
    });

    it('should succeed with top level comment and nested reply', async () => {
      // Top level comment
      const commentRes = await request(app)
        .post(`/posts/${post._id}/comments`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ content: 'Here is an answer' });

      expect(commentRes.statusCode).toEqual(201);
      expect(commentRes.body.comment.parentComment).toBeNull();

      // Nested reply
      const replyRes = await request(app)
        .post(`/posts/${post._id}/comments`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          content: 'Thanks for the answer!',
          parentComment: commentRes.body.comment._id
        });

      expect(replyRes.statusCode).toEqual(201);
      expect(replyRes.body.comment.parentComment).toEqual(commentRes.body.comment._id);
    });

    it('should return 400 if parentComment references a comment from a different post', async () => {
      // Create second post
      const post2Res = await request(app)
        .post('/posts')
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          subjectId: subject._id,
          title: 'Second Post',
          content: 'Content 2'
        });

      // Create comment on post 1
      const commentRes = await request(app)
        .post(`/posts/${post._id}/comments`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send({ content: 'Post 1 comment' });

      // Try replying to post 1 comment under post 2 endpoint
      const res = await request(app)
        .post(`/posts/${post2Res.body.post._id}/comments`)
        .set('Authorization', `Bearer ${authorToken}`)
        .send({
          content: 'Cross post comment',
          parentComment: commentRes.body.comment._id
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error.message).toMatch(/different post/i);
    });
  });
});
