//RailRoad/routes/userRoutes.js
const express = require('express');
const { authenticate,isEmployee,isAdmin } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/profile', authenticate,isEmployee, userController.getProfile);
router.put('/:id?', authenticate, userController.updateProfile);
router.delete('/profile', authenticate, userController.deleteProfile);

module.exports = router;
