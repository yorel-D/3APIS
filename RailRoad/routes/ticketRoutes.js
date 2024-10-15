//RailRoad/routes/ticketRoutes.js
const express = require('express');
const ticketController = require('../controllers/ticketController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticate, ticketController.bookTicket);
router.put('/:id/validate', authenticate, ticketController.validateTicket);

module.exports = router;
