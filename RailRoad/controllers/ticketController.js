const Ticket = require('../models/Ticket');
const Train = require('../models/Train');
const User = require('../models/User');
const TrainStation = require('../models/TrainStation');

// Book a ticket
exports.bookTicket = async (req, res) => {
  try {
    const { trainId, userId } = req.body;

    // Vérifier si le train existe
    const train = await Train.findById(trainId).populate('departureStation').populate('arrivalStation');
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }

    // Vérifier si l'utilisateur existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Vérifier que les stations de départ et d'arrivée existent et sont associées au train
    const departureStationExists = await TrainStation.findById(train.departureStation._id);
    const arrivalStationExists = await TrainStation.findById(train.arrivalStation._id);

    if (!departureStationExists || !arrivalStationExists) {
      return res.status(400).json({ message: 'Departure or Arrival station does not exist.' });
    }

    // Vérifier si l'utilisateur a déjà un ticket pour ce train
    const existingTicket = await Ticket.findOne({ trainId, userId });
    if (existingTicket) {
      return res.status(400).json({ message: 'User already has a ticket for this train.' });
    }

    // Créer le ticket après toutes les vérifications
    const ticket = await Ticket.create({ trainId, userId });
    res.status(201).json({
      message: 'Ticket booked successfully.',
      ticket
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Validate a ticket
exports.validateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    ticket.validated = true;
    await ticket.save();
    res.json({ message: 'Ticket validated successfully.', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
