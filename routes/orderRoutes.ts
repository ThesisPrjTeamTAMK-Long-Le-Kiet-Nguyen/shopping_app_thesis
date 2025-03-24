import { Router } from 'express';
import {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    deleteOrder
} from '../controllers/order';
import { authenticateUser, isAdmin } from '../utils/authenticate';

const router = Router();

// User routes
router.post('/', authenticateUser, createOrder);
router.get('/user', authenticateUser, getUserOrders);
router.get('/:id', authenticateUser, getOrderById);
router.post('/:id/cancel', authenticateUser, cancelOrder);

// Admin routes
router.get('/admin/all', authenticateUser, isAdmin, getAllOrders);
router.put('/admin/:id/status', authenticateUser, isAdmin, updateOrderStatus);
router.put('/admin/:id/payment', authenticateUser, isAdmin, updatePaymentStatus);
router.delete('/admin/:id', authenticateUser, isAdmin, deleteOrder);

export default router;