//RailRoad/controllers/stationController.js
const Train = require('../models/Train'); // Ajoutez cette ligne
const TrainStation = require('../models/TrainStation');
const Ticket = require('../models/Ticket');

// Get all train stations
exports.getStations = async (req, res) => {
  const stations = await TrainStation.find({});
  res.json(stations);
};

// Create a new train station
exports.createStation = async (req, res) => {
  const { name, open_hour, close_hour, image } = req.body;
  const station = await TrainStation.create({ name, open_hour, close_hour, image });
  res.status(201).json(station);
};

// Update a train station
exports.updateStation = async (req, res) => {
  const station = await TrainStation.findById(req.params.id);
  if (!station) {
    return res.status(404).json({ message: 'Station not found' });
  }

  station.name = req.body.name || station.name;
  station.open_hour = req.body.open_hour || station.open_hour;
  station.close_hour = req.body.close_hour || station.close_hour;
  station.image = req.body.image || station.image;
  await station.save();

  res.json(station);
};
// Supprimer une station
exports.deleteStation = async (req, res) => {
  try {
    const station = await TrainStation.findById(req.params.id);
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    console.log("Attempting to delete station:", station.name);

    // Find trains associated with the station
    const trains = await Train.find({
      $or: [
        { departureStation: station._id },
        { arrivalStation: station._id }
      ]
    });

    // Log trains being deleted
    console.log("Trains associated with this station:", trains);

    // Delete tickets for trains associated with this station
    const deletedTickets = await Ticket.deleteMany({
      trainId: { $in: trains.map(train => train._id) }
    });
    console.log(`Deleted tickets count: ${deletedTickets.deletedCount}`);

    // Supprimer la station
    await station.deleteOne(); // This will trigger the middleware to delete associated trains

    res.json({ message: 'Station deleted successfully, and associated trains and tickets removed.' });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};