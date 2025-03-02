const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const { authenticateUser } = require('../utils/authenticate');

// User registration route
router.post('/register', user.registerUser);

// Get user profile route (protected)
router.get('/profile', authenticateUser, user.getUserProfile);

// Update user profile route (protected)
router.put('/profile', authenticateUser, user.updateUserProfile);

// Delete user account route (protected)
router.delete('/account', authenticateUser, user.deleteUserAccount);

module.exports = router;