//RailRoad/models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  trainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  validated: { type: Boolean, default: false },
});

module.exports = mongoose.model('Ticket', ticketSchema);
