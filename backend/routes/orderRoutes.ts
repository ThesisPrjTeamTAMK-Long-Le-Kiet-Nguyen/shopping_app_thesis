const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const { authenticateUser } = require('../utils/authenticate');

// Create a new order
router.post('/', authenticateUser, orderController.createOrder);

// Get all orders for a user
router.get('/', authenticateUser, orderController.getUserOrders);

// Update an order
router.put('/:id', authenticateUser, orderController.updateOrder);

// Delete an order
router.delete('/:id', authenticateUser, orderController.deleteOrder);

module.exports = router;