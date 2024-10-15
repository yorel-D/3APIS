//RailRoad/models/TrainStation.js
const mongoose = require('mongoose');

const trainStationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  open_hour: { type: String, required: true },
  close_hour: { type: String, required: true },
  image: { type: String, required: true },
});

// Middleware pour supprimer les trains et les tickets associés avant de supprimer une station
trainStationSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    // Supprime tous les trains liés à cette station
    await mongoose.model('Train').deleteMany({
      $or: [
        { departureStation: this._id },
        { arrivalStation: this._id }
      ]
    });

    // Supprime tous les tickets liés aux trains supprimés
    await mongoose.model('Ticket').deleteMany({
      trainId: { $in: this._id }
    });

    next();
  } catch (error) {
    next(error);
  }
});

const TrainStation = mongoose.model('TrainStation', trainStationSchema);
module.exports = TrainStation;
