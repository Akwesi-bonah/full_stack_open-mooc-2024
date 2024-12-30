const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app'); 
const User = require('../models/user');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
});

describe('User creation', () => {
  test('succeeds with valid data', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Test User',
      password: 'securepassword',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.find({});
    expect(usersAtEnd).toHaveLength(1);
    expect(usersAtEnd[0].username).toBe(newUser.username);
  });

  test('fails with missing username or password', async () => {
    const newUser = { name: 'Missing Username' };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    expect(result.body.error).toContain('Username and password are required');
  });

  test('fails if username or password is too short', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: '12',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    expect(result.body.error).toContain('must be at least 3 characters long');
  });

  test('fails if username is not unique', async () => {
    const newUser = {
      username: 'uniqueuser',
      name: 'First User',
      password: 'securepassword',
    };

    await api.post('/api/users').send(newUser);

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400);

    expect(result.body.error).toContain('Username must be unique');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
