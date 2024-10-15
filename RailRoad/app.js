//RailRoad/app.js
const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const trainRoutes = require('./routes/trainRoutes');
const stationRoutes = require('./routes/stationRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/tickets', ticketRoutes);

app.listen(5001, () => {
  console.log('Server running on port 5001');
});

module.exports = app;
