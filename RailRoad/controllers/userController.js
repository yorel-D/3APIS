//RailRoad/controllers/userController.js
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const jwt = require('jsonwebtoken');

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const users = await User.find({}).select('-password'); // Exclure le mot de passe des résultats
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
exports.updateProfile = async (req, res) => {
  // Check if an ID is provided in the URL
  const userId = req.params.id || req.user.id; // Use provided ID or current user ID
  const { pseudo, email,password } = req.body;

  // Find the user to update
  const user = await User.findById(userId);
  console.log(`Updating user with ID: ${user}`);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Only allow the user or an admin to update
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access forbidden' });
  }

  // Update the user information
  user.pseudo = pseudo || user.pseudo;
  user.email = email || user.email;
  user.password = password || user.password;
  await user.save();

  res.json({ message: 'Profile updated successfully', user });
};


// Delete user and associated tickets
exports.deleteProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Extract the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
        
        const userId = decoded.id; // Get the user ID from the token

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Fetch and log associated tickets for this user
        const tickets = await Ticket.find({ userId: userId });
        // Delete associated tickets for this user
        const deletedTickets = await Ticket.deleteMany({ userId: userId });


        // Delete the user
        await User.findByIdAndDelete(userId);

        res.json({ message: "User and associated tickets deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Server error.", error: error.message });
    }
};
