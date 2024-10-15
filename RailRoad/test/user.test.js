const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('User API', () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({});
    const user = await User.create({ email: 'test@example.com', pseudo: 'test', password: '123456' });
    token = user.generateToken();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'new@example.com', pseudo: 'newuser', password: '123456' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: '123456' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
