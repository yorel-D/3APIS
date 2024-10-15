const Train = require('../models/Train');
const TrainStation = require('../models/TrainStation'); // Assurez-vous que ce modèle est correctement importé
const Ticket = require('../models/Ticket');
// Get all trains
exports.getTrains = async (req, res) => {
  try {
    const trains = await Train.find({})
      .populate('departureStation arrivalStation', 'name'); // Remplace l'ID par le nom des stations
    res.json(trains);
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Create a new train
exports.createTrain = async (req, res) => {
  try {
    const { name, departureStation, arrivalStation, departureTime, arrivalTime } = req.body;

    // Vérifiez si les stations existent en recherchant par nom
    const departureStationExists = await TrainStation.findOne({ name: departureStation });
    const arrivalStationExists = await TrainStation.findOne({ name: arrivalStation });

    if (!departureStationExists) {
      return res.status(400).json({ message: "Departure station does not exist." });
    }

    if (!arrivalStationExists) {
      return res.status(400).json({ message: "Arrival station does not exist." });
    }

    // Créez le train seulement si les stations existent
    const newTrain = new Train({
      name,
      departureStation: departureStationExists._id,
      arrivalStation: arrivalStationExists._id,
      departureTime,
      arrivalTime
    });

    await newTrain.save();

    // Populer pour renvoyer les noms des stations dans la réponse
    const populatedTrain = await Train.findById(newTrain._id)
      .populate('departureStation arrivalStation', 'name');

    res.status(201).json({ message: "Train created successfully.", train: populatedTrain });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Update a train
exports.updateTrain = async (req, res) => {
  try {
    const { name, departureStation, arrivalStation, departureTime, arrivalTime } = req.body;

    const train = await Train.findById(req.params.id);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    // Vérifiez si les nouvelles stations existent si elles sont fournies
    if (departureStation) {
      const departureStationExists = await TrainStation.findOne({ name: departureStation });
      if (!departureStationExists) {
        return res.status(400).json({ message: "Departure station does not exist." });
      }
      train.departureStation = departureStationExists._id;
    }

    if (arrivalStation) {
      const arrivalStationExists = await TrainStation.findOne({ name: arrivalStation });
      if (!arrivalStationExists) {
        return res.status(400).json({ message: "Arrival station does not exist." });
      }
      train.arrivalStation = arrivalStationExists._id;
    }

    // Mise à jour des autres informations du train
    train.name = name || train.name;
    train.departureTime = departureTime || train.departureTime;
    train.arrivalTime = arrivalTime || train.arrivalTime;

    await train.save();

    // Populer pour renvoyer les noms des stations dans la réponse
    const populatedTrain = await Train.findById(train._id)
      .populate('departureStation arrivalStation', 'name');

    res.json({ message: "Train updated successfully.", train: populatedTrain });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

// Delete a train
exports.deleteTrain = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    // Supprimer les tickets liés à ce train
    await Ticket.deleteMany({ trainId: train._id });

    // Supprimer le train
    await train.deleteOne(); // Utilise deleteOne au lieu de remove()

    res.json({ message: 'Train and associated tickets deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

