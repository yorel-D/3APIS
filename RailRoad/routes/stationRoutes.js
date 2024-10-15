//RailRoad/routes/stationRoutes.js
const express = require('express');
const { authenticate, isAdmin } = require('../middlewares/authMiddleware');
const stationController = require('../controllers/stationController');
const router = express.Router();

router.get('/', stationController.getStations);
router.post('/', authenticate, isAdmin, stationController.createStation);
router.put('/:id', authenticate, isAdmin, stationController.updateStation);
router.delete('/:id', authenticate, isAdmin, stationController.deleteStation);

module.exports = router;
