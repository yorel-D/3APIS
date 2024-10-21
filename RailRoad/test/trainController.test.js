// tests/trainController.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Train = require('../models/Train');
const TrainStation = require('../models/TrainStation');
const Ticket = require('../models/Ticket');
const { getTrains, createTrain, updateTrain, deleteTrain } = require('../controllers/trainController');

// Mock des modèles Mongoose
jest.mock('../models/Train');
jest.mock('../models/TrainStation');
jest.mock('../models/Ticket');

const app = express();
app.use(express.json());

// Définition des routes
app.get('/trains', getTrains);
app.post('/trains', createTrain);
app.put('/trains/:id', updateTrain);
app.delete('/trains/:id', deleteTrain);

describe('Train Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createTrain', () => {
        it('should return 400 if departure station does not exist', async () => {
            TrainStation.findOne.mockResolvedValueOnce(null);

            const res = await request(app).post('/trains').send({
                name: 'Train 1',
                departureStation: 'Station A',
                arrivalStation: 'Station B',
                departureTime: new Date(),
                arrivalTime: new Date(),
            });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Departure station does not exist.');
        });

        it('should return 400 if arrival station does not exist', async () => {
            const mockDepartureStation = { _id: new mongoose.Types.ObjectId(), name: 'Station A' };
            TrainStation.findOne
                .mockResolvedValueOnce(mockDepartureStation)
                .mockResolvedValueOnce(null);

            const res = await request(app).post('/trains').send({
                name: 'Train 1',
                departureStation: 'Station A',
                arrivalStation: 'Station B',
                departureTime: new Date(),
                arrivalTime: new Date(),
            });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Arrival station does not exist.');
        });

        it('should handle server errors', async () => {
            const mockDepartureStation = { _id: new mongoose.Types.ObjectId(), name: 'Station A' };
            const mockArrivalStation = { _id: new mongoose.Types.ObjectId(), name: 'Station B' };

            TrainStation.findOne
                .mockResolvedValueOnce(mockDepartureStation)
                .mockResolvedValueOnce(mockArrivalStation);

            Train.mockImplementation(() => {
                throw new Error('Database error');
            });

            const res = await request(app).post('/trains').send({
                name: 'Train 1',
                departureStation: 'Station A',
                arrivalStation: 'Station B',
                departureTime: new Date(),
                arrivalTime: new Date(),
            });

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Server error.');
        });
    });

    describe('updateTrain', () => {
        it('should return 404 if train is not found', async () => {
            Train.findById.mockResolvedValue(null);

            const res = await request(app).put(`/trains/${new mongoose.Types.ObjectId()}`).send({
                name: 'Train 1 Updated',
            });

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Train not found');
        });

        it('should handle server errors', async () => {
            const mockTrain = { _id: new mongoose.Types.ObjectId(), name: 'Train 1' };
            Train.findById.mockResolvedValue(mockTrain);
            TrainStation.findOne.mockRejectedValue(new Error('Database error'));

            const res = await request(app).put(`/trains/${mockTrain._id}`).send({
                name: 'Train 1 Updated',
            });

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Server error.');
        });
    });

    describe('deleteTrain', () => {
        it('should return 404 if train is not found', async () => {
            Train.findById.mockResolvedValue(null);

            const res = await request(app).delete(`/trains/${new mongoose.Types.ObjectId()}`);

            expect(res.statusCode).toBe(404);
            expect(res.body.message).toBe('Train not found');
        });

        it('should handle server errors when deleting a train', async () => {
            const mockTrain = { _id: new mongoose.Types.ObjectId() };
            Train.findById.mockResolvedValue(mockTrain);
            Ticket.deleteMany.mockRejectedValue(new Error('Database error'));

            const res = await request(app).delete(`/trains/${mockTrain._id}`);

            expect(res.statusCode).toBe(500);
            expect(res.body.message).toBe('Server error.');
        });
    });
});
