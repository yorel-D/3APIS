//RailRoad/models/Train.js
const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  departureStation: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainStation', required: true },
  arrivalStation: { type: mongoose.Schema.Types.ObjectId, ref: 'TrainStation', required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
}, { timestamps: true });

// Middleware pour supprimer les tickets associés avant de supprimer un train
trainSchema.pre('remove', async function(next) {
  try {
    await mongoose.model('Ticket').deleteMany({ train: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

const Train = mongoose.model('Train', trainSchema);
module.exports = Train;
