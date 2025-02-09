const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateUser } = require('../middleware/authenticate');

// User registration route
router.post('/register', userController.registerUser);

// User login route
router.post('/login', userController.loginUser);

// Get user profile route (protected)
router.get('/profile', authenticateUser, userController.getUserProfile);

// Update user profile route (protected)
router.put('/profile', authenticateUser, userController.updateUserProfile);

// Delete user account route (protected)
router.delete('/account', authenticateUser, userController.deleteUserAccount);

module.exports = router;