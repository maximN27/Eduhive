const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('../../src/server');
const connectDB = require('../../src/config/db');
const User = require('../../src/models/User');

let mongoServer;

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
});

describe('Auth API Integration Tests', () => {
  const validUser = {
    username: 'johndoe',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'student'
  };

  describe('POST /auth/register', () => {
    it('should succeed with valid data and return JWT token and user object without passwordHash', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send(validUser);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user.email).toEqual(validUser.email);
      expect(res.body.user).not.toHaveProperty('passwordHash');
    });

    it('should reject duplicate email with 409 status', async () => {
      await request(app).post('/auth/register').send(validUser);

      const res = await request(app)
        .post('/auth/register')
        .send({
          ...validUser,
          username: 'johndoe2'
        });

      expect(res.statusCode).toEqual(409);
      expect(res.body.error.message).toMatch(/already exists/i);
    });

    it('should reject missing required fields with 400 status', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'incomplete@example.com' });

      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/auth/register').send(validUser);
    });

    it('should succeed with correct credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: validUser.email,
          password: validUser.password
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toEqual(validUser.email);
      expect(res.body.user).not.toHaveProperty('passwordHash');
    });

    it('should reject wrong password with 401 status', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: validUser.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.error.message).toMatch(/invalid/i);
    });

    it('should reject nonexistent email with 401 status', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'nobody@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body.error.message).toMatch(/invalid/i);
    });
  });

  describe('GET /auth/me', () => {
    it('should return 401 with no token provided', async () => {
      const res = await request(app).get('/auth/me');
      expect(res.statusCode).toEqual(401);
    });

    it('should return 200 with valid token and user data without passwordHash', async () => {
      const registerRes = await request(app).post('/auth/register').send(validUser);
      const token = registerRes.body.token;

      const res = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.user.email).toEqual(validUser.email);
      expect(res.body.user).not.toHaveProperty('passwordHash');
    });
  });
});
