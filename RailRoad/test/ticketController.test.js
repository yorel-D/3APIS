// tests/ticketController.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const Train = require('../models/Train');
const User = require('../models/User');
const TrainStation = require('../models/TrainStation');
const { bookTicket, validateTicket } = require('../controllers/ticketController');

// Charger les variables d'environnement
require('dotenv').config();

// Mock des modèles
jest.mock('../models/Ticket');
jest.mock('../models/Train');
jest.mock('../models/User');
jest.mock('../models/TrainStation');

const app = express();
app.use(express.json());

app.post('/book-ticket', bookTicket);
app.put('/validate-ticket/:id', validateTicket);

describe('Ticket Controller', () => {
  beforeAll(async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:5001/';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Tests pour bookTicket
  describe('bookTicket', () => {
    it('should return 500 if there is a server error while finding the train', async () => {
      Train.findById.mockImplementation(() => {
        throw new Error('Database error');
      });

      const res = await request(app).post('/book-ticket').send({
        trainId: 'someTrainId',
        userId: 'someUserId',
      });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Server error.');
    });

    it('should return 500 if there is a server error while finding the user', async () => {
      Train.findById.mockResolvedValue({ _id: new mongoose.Types.ObjectId() });
      User.findById.mockImplementation(() => {
        throw new Error('Database error');
      });

      const res = await request(app).post('/book-ticket').send({
        trainId: 'someTrainId',
        userId: 'someUserId',
      });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Server error.');
    });

    it('should return 500 if there is a server error while creating the ticket', async () => {
      const mockTrain = { _id: new mongoose.Types.ObjectId() };
      const mockUser = { _id: new mongoose.Types.ObjectId() };
      Train.findById.mockResolvedValue(mockTrain);
      User.findById.mockResolvedValue(mockUser);
      Ticket.findOne.mockResolvedValue(null);

      Ticket.create.mockImplementation(() => {
        throw new Error('Database error');
      });

      const res = await request(app).post('/book-ticket').send({
        trainId: mockTrain._id,
        userId: mockUser._id,
      });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Server error.');
    });
  });

  // Tests pour validateTicket
  describe('validateTicket', () => {
    it('should return 500 if there is a server error while finding the ticket', async () => {
      Ticket.findById.mockImplementation(() => {
        throw new Error('Database error');
      });

      const res = await request(app).put('/validate-ticket/12345');

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Server error.');
    });

    it('should return 500 if there is a server error while saving the ticket', async () => {
      const mockTicket = {
        _id: new mongoose.Types.ObjectId(),
        validated: false,
        save: jest.fn().mockImplementation(() => {
          throw new Error('Database error');
        }),
      };
      Ticket.findById.mockResolvedValue(mockTicket);

      const res = await request(app).put(`/validate-ticket/${mockTicket._id}`);

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Server error.');
    });

    it('should return 404 if ticket is not found', async () => {
      Ticket.findById.mockResolvedValue(null);

      const res = await request(app).put('/validate-ticket/12345');

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Ticket not found');
    });

    it('should validate the ticket and return 200 if found', async () => {
      const mockTicket = {
        _id: new mongoose.Types.ObjectId(),
        validated: false,
        save: jest.fn().mockResolvedValue(true), // Ensure save is resolved
      };
      Ticket.findById.mockResolvedValue(mockTicket);

      const res = await request(app).put(`/validate-ticket/${mockTicket._id}`);

      expect(res.statusCode).toBe(200);
      expect(mockTicket.validated).toBe(true);
      expect(res.body.message).toBe('Ticket validated successfully.');
    });
  });
});
