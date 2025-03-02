const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart');
const { authenticateUser } = require('../utils/authenticate');

// Add item to cart
router.post('/', authenticateUser, cartController.addToCart);

// Get user's cart
router.get('/', authenticateUser, cartController.getCart);

// Remove item from cart
router.delete('/:id', authenticateUser, cartController.removeFromCart);

module.exports = router;