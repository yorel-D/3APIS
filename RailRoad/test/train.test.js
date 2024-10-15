const request = require('supertest');
const app = require('../app');
const Train = require('../models/Train');

describe('Train API', () => {
  let token;

  beforeEach(async () => {
    await Train.deleteMany({});
    const train = await Train.create({ name: 'Express', start_station: 'A', end_station: 'B', time_of_departure: new Date() });
    token = process.env.JWT_TOKEN; // Simulate admin token
  });

  it('should create a new train', async () => {
    const res = await request(app)
      .post('/api/trains')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Train', start_station: 'C', end_station: 'D', time_of_departure: new Date() });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should get all trains', async () => {
    const res = await request(app).get('/api/trains');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
