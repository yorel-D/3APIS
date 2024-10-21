const request = require('supertest');
const express = require('express');
const stationRoutes = require('../routes/stationRoutes');
const TrainStation = require('../models/TrainStation');
const Train = require('../models/Train');
const Ticket = require('../models/Ticket');

jest.mock('../models/TrainStation');
jest.mock('../models/Train');
jest.mock('../models/Ticket');

jest.mock('../middlewares/authMiddleware');

const { authenticate, isAdmin } = require('../middlewares/authMiddleware');

const app = express();
app.use(express.json());
app.use('/api/stations', stationRoutes);

const mockToken = 'Bearer mockToken';

describe('Station Controller', () => {
  beforeAll(() => {
    authenticate.mockImplementation((req, res, next) => {
      req.user = { id: '123', role: 'admin' };
      next();
    });
    isAdmin.mockImplementation((req, res, next) => {
      next();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should get all stations', async () => {
    const mockStations = [
      { _id: '1', name: 'Station 1', open_hour: '08:00', close_hour: '20:00', image: 'image1.png' },
      { _id: '2', name: 'Station 2', open_hour: '09:00', close_hour: '21:00', image: 'image2.png' },
    ];

    TrainStation.find.mockResolvedValue(mockStations);

    const response = await request(app).get('/api/stations');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockStations);
  });

  test('should create a new station', async () => {
    const newStation = {
      name: 'Station 3',
      open_hour: '06:00',
      close_hour: '22:00',
      image: 'image3.png',
    };

    TrainStation.create.mockResolvedValue(newStation);

    const response = await request(app)
      .post('/api/stations')
      .set('Authorization', mockToken)
      .send(newStation);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(newStation);
  });

  test('should update a station', async () => {
    const updatedStation = {
      _id: '1',
      name: 'Updated Station',
      open_hour: '07:00',
      close_hour: '19:00',
      image: 'updated_image.png',
    };

    TrainStation.findById.mockResolvedValue({
      ...updatedStation,
      save: jest.fn().mockResolvedValue(updatedStation),
    });

    const response = await request(app)
      .put('/api/stations/1')
      .set('Authorization', mockToken)
      .send(updatedStation);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(updatedStation);
  });

  test('should return 404 if station not found for update', async () => {
    TrainStation.findById.mockResolvedValue(null);

    const response = await request(app)
      .put('/api/stations/1')
      .set('Authorization', mockToken)
      .send({ name: 'Updated Station' });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Station not found' });
  });

  test('should delete a station and associated trains and tickets', async () => {
    const mockStation = {
      _id: '1',
      name: 'Station 1',
      open_hour: '08:00',
      close_hour: '20:00',
      image: 'image1.png',
      deleteOne: jest.fn().mockResolvedValue(),
    };

    TrainStation.findById.mockResolvedValue(mockStation);
    Train.find.mockResolvedValue([]);
    Ticket.deleteMany.mockResolvedValue({ deletedCount: 0 });

    const response = await request(app)
      .delete('/api/stations/1')
      .set('Authorization', mockToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Station deleted successfully, and associated trains and tickets removed.' });
  });

  test('should return 404 if station not found for delete', async () => {
    TrainStation.findById.mockResolvedValue(null);

    const response = await request(app)
      .delete('/api/stations/1')
      .set('Authorization', mockToken);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Station not found' });
  });

  test('should handle server error on delete', async () => {
    const mockStation = {
      _id: '1',
      name: 'Station 1',
      deleteOne: jest.fn().mockRejectedValue(new Error('Delete error')),
    };

    TrainStation.findById.mockResolvedValue(mockStation);

    const response = await request(app)
      .delete('/api/stations/1')
      .set('Authorization', mockToken);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Server error.', error: 'Delete error' });
  });
});
