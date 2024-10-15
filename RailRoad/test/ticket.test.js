const request = require('supertest');
const app = require('../app');
const Ticket = require('../models/Ticket');

describe('Ticket API', () => {
  let token;

  beforeEach(async () => {
    await Ticket.deleteMany({});
    const ticket = await Ticket.create({ trainId: 'some_train_id', userId: 'some_user_id' });
    token = process.env.JWT_TOKEN; // Simulate user token
  });

  it('should book a ticket', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({ trainId: 'some_train_id', userId: 'some_user_id' });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
  });

  it('should validate a ticket', async () => {
    const res = await request(app)
      .put('/api/tickets/some_ticket_id/validate')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.validated).toBe(true);
  });
});
