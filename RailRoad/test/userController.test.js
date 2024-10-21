const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const authRoutes = require('../routes/authRoutes');

jest.mock('../models/User');
jest.mock('../models/Ticket');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

const authenticate = (req, res, next) => {
    req.user = { id: new mongoose.Types.ObjectId(), role: 'user' };
    next();
};

app.get('/profile', authenticate, async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json(users);
});

app.put('/users/:id?', authenticate, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user._id.toString() !== req.user.id) return res.status(403).json({ message: 'Access forbidden' });

    Object.assign(user, req.body);
    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
});

app.delete('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found.' });

        await Ticket.deleteMany({ userId: user._id });
        await User.findByIdAndDelete(user._id);
        res.status(200).json({ message: 'User and associated tickets deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
});

describe('User Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return 404 if user is not found in updateProfile', async () => {
        User.findById.mockResolvedValue(null);

        const response = await request(app)
            .put(`/users/${new mongoose.Types.ObjectId()}`)
            .send({
                pseudo: 'UpdatedUser1',
            });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found');
    });

    test('should return 403 if user tries to update another user', async () => {
        const mockUser = { _id: '671562385024b10d2e1fe2aa', email: 'user1@example.com', pseudo: 'User1', password: 'hashedPassword' };
        User.findById.mockResolvedValue(mockUser);
        const anotherUserId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .put(`/users/${anotherUserId}`)
            .send({
                pseudo: 'UpdatedUser1',
            });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Access forbidden');
    });

    test('should delete the user profile and associated tickets', async () => {
        const mockUser = { _id: '671562385024b10d2e1fe2aa', email: 'user1@example.com', pseudo: 'User1' };
        User.findById.mockResolvedValue(mockUser);
        Ticket.deleteMany.mockResolvedValue({});
        User.findByIdAndDelete.mockResolvedValue(mockUser);

        const response = await request(app).delete('/profile');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('User and associated tickets deleted successfully.');
    });

    test('should return 404 if user is not found in deleteProfile', async () => {
        User.findById.mockResolvedValue(null);

        const response = await request(app).delete('/profile');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('User not found.');
    });

    test('should handle server error on delete', async () => {
        const mockUser = {
            _id: '671562385024b10d2e1fe2aa',
            email: 'user1@example.com',
            pseudo: 'User1',
        };
        
        User.findById.mockResolvedValue(mockUser);
        Ticket.deleteMany.mockResolvedValue({});
        User.findByIdAndDelete.mockRejectedValue(new Error('Delete error'));

        const response = await request(app).delete('/profile');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Server error.', error: 'Delete error' });
    });
});
