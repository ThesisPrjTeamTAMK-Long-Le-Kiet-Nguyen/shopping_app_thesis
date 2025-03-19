import { Router } from 'express';
const router = Router();
import orderController from '../controllers/order';
import { authenticateUser } from'../utils/authenticate';

// Create a new order
router.post('/', authenticateUser, orderController.createOrder);

// Get all orders for a user
router.get('/', authenticateUser, orderController.getUserOrders);

// Update an order
// router.put('/:id', authenticateUser, orderController.updateOrder);

// // Delete an order
// router.delete('/:id', authenticateUser, orderController.deleteOrder);

module.exports = router;