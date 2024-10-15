const request = require('supertest');
const app = require('../app');
const TrainStation = require('../models/TrainStation');

describe('Train Station API', () => {
  let token;

  beforeEach(async () => {
    await TrainStation.deleteMany({});
    const station = await TrainStation.create({ name: 'Central', open_hour: '6:00 AM', close_hour: '11:00 PM', image: 'image_url' });
    token = process.env.JWT_TOKEN; // Simulate admin token
  });

  it('should create a new train station', async () => {
    const res = await request(app)
      .post('/api/stations')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New Station', open_hour: '6:00 AM', close_hour: '11:00 PM', image: 'new_image_url' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should get all train stations', async () => {
    const res = await request(app).get('/api/stations');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
