const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

jest.mock('../models/User');
jest.mock('../utils/generateToken');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should register a new user successfully', async () => {
    User.findOne.mockResolvedValue(null);
    User.prototype.save = jest.fn().mockResolvedValue();

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        pseudo: 'testuser',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User created successfully.' });
  });

  test('should return 400 if email already exists', async () => {
    User.findOne.mockResolvedValue({});

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        pseudo: 'testuser',
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Email already exists.' });
  });

  test('should return 400 if pseudo already exists', async () => {
    User.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({});

    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        pseudo: 'testuser',
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Pseudo already exists.' });
  });

  test('should login user successfully', async () => {
    const mockUser = {
      _id: 'userId',
      email: 'test@example.com',
      password: 'password123',
      matchPassword: jest.fn().mockResolvedValue(true)
    };

    User.findOne.mockResolvedValue(mockUser);
    const token = 'mocked_token';
    generateToken.mockReturnValue(token);

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        pseudo: 'testuser',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ token });
  });

  test('should return 401 if login credentials are invalid', async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invalid@example.com',
        pseudo: 'testr',
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Invalid email or password' });
  });
});
