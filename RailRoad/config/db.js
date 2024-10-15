//RailRoad/config/db.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;
    const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

    try {
        await mongoose.connect(uri, clientOptions);
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
