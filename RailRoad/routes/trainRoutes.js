//RailRoad/routes/trainRoutes.js
const express = require('express');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');
const trainController = require('../controllers/trainController');
const router = express.Router();

router.get('/', trainController.getTrains);
router.post('/', authenticate, isAdmin, trainController.createTrain);
router.put('/:id', authenticate, isAdmin, trainController.updateTrain);
router.delete('/:id', authenticate, isAdmin, trainController.deleteTrain);

module.exports = router;

