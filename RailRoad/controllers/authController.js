//RailRoad/controllers/authController.js
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

// Register a new user
exports.register = async (req, res) => {
    const { email, pseudo, password, role } = req.body;
    const username = req.body.username || pseudo.toLowerCase().replace(/\s/g, '');
    try {
        // Vérifiez si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        const existingPseudo = await User.findOne({ pseudo });
        if (existingPseudo) {
            return res.status(400).json({ message: 'Pseudo already exists.' });
        }

        const newUser = new User({
            email,
            pseudo,
            username,
            password,
            role: role || 'user',
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
        console.error("Error creating user:", error); // Log de l'erreur
        res.status(500).json({ message: 'Server error.', error });
    }
};

  

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};
