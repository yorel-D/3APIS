//RailRoad/routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');
const { validate, userSchema } = require('../middlewares/validation');

const router = express.Router();

router.post('/register', validate(userSchema), register);
router.post('/login', validate(userSchema), login);

module.exports = router;
