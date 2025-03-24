import { Request, Response } from 'express';
import { OrderModel } from '../models/order';
import { CartModel } from '../models/cart';
import { ApiResponse, Order, CartItem } from '../types';

// Extended Request type to include user property from auth middleware
interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

// Create a new order
export const createOrder = async (
    req: AuthRequest,
    res: Response<ApiResponse<Order>>
): Promise<void> => {
    try {
        const { receiverName, phoneNumber, address, note, paymentMethod } = req.body;
        const userId = req.user?.id;

        // Get cart items
        const cart = await CartModel.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            res.status(400).json({
                success: false,
                error: 'Cart is empty'
            });
            return;
        }

        // Calculate total amount
        const totalAmount = cart.items.reduce((total: number, item: CartItem) => 
            total + (item.price * item.quantity), 0);

        // Generate order number
        const lastOrder = await OrderModel.findOne().sort({ orderNumber: -1 });
        const lastNumber = lastOrder ? parseInt(lastOrder.orderNumber.split('-')[1]) : 0;
        const orderNumber = `ORD-${String(lastNumber + 1).padStart(6, '0')}`;

        // Create new order
        const order = new OrderModel({
            orderNumber,
            userId,
            receiverName,
            phoneNumber,
            address,
            note,
            items: cart.items.map((item: CartItem) => ({
                productId: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                color: item.color,
                type: item.type
            })),
            totalAmount,
            paymentMethod,
            paymentStatus: 'pending',
            orderStatus: 'pending'
        });

        await order.save();

        // Clear the cart after successful order creation
        await CartModel.findOneAndUpdate({ userId }, { $set: { items: [] } });

        res.status(201).json({
            success: true,
            data: order,
            message: 'Order created successfully'
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create order'
        });
    }
};

// Get all orders (admin only)
export const getAllOrders = async (
    req: AuthRequest,
    res: Response<ApiResponse<Order[]>>
): Promise<void> => {
    try {
        const orders = await OrderModel.find()
            .sort({ createdAt: -1 })
            .populate('userId', 'email'); // Populate user email for admin view

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch orders'
        });
    }
};

// Get user's orders
export const getUserOrders = async (
    req: AuthRequest,
    res: Response<ApiResponse<Order[]>>
): Promise<void> => {
    try {
        const userId = req.user?.id;
        const orders = await OrderModel.find({ userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user orders'
        });
    }
};

// Get order by ID
export const getOrderById = async (
    req: AuthRequest,
    res: Response<ApiResponse<Order>>
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const isAdmin = req.user?.role === 'admin';

        const order = await OrderModel.findById(id);

        if (!order) {
            res.status(404).json({
                success: false,
                error: 'Order not found'
            });
            return;
        }

        // Check if user has permission to view this order
        if (!isAdmin && order.userId.toString() !== userId) {
            res.status(403).json({
                success: false,
                error: 'Access denied'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch order'
        });
    }
};

// Update order status (admin only)
export const updateOrderStatus = async (
    req: AuthRequest,
    res: Response<ApiResponse<Order>>
): Promise<void> => {
    try {
        const { id } = req.params;
        const { orderStatus } = req.body;

        // Validate order status
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(orderStatus)) {
            res.status(400).json({
                success: false,
                error: 'Invalid order status'
            });
            return;
        }

        const order = await OrderModel.findById(id);
        if (!order) {
            res.status(404).json({
                success: false,
                error: 'Order not found'
            });
            return;
        }

        // Update order status
        order.orderStatus = orderStatus;
        await order.save();

        res.status(200).json({
            success: true,
            data: order,
            message: 'Order status updated successfully'
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update order status'
        });
    }
};

// Update payment status (admin only)
export const updatePaymentStatus = async (
    req: AuthRequest,
    res: Response<ApiResponse<Order>>
): Promise<void> => {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;

        // Validate payment status
        const validStatuses = ['pending', 'paid', 'failed'];
        if (!validStatuses.includes(paymentStatus)) {
            res.status(400).json({
                success: false,
                error: 'Invalid payment status'
            });
            return;
        }

        const order = await OrderModel.findById(id);
        if (!order) {
            res.status(404).json({
                success: false,
                error: 'Order not found'
            });
            return;
        }

        // Update payment status
        order.paymentStatus = paymentStatus;
        await order.save();

        res.status(200).json({
            success: true,
            data: order,
            message: 'Payment status updated successfully'
        });
    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update payment status'
        });
    }
};

// Cancel order (user or admin)
export const cancelOrder = async (
    req: AuthRequest,
    res: Response<ApiResponse<Order>>
): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const isAdmin = req.user?.role === 'admin';

        const order = await OrderModel.findById(id);

        if (!order) {
            res.status(404).json({
                success: false,
                error: 'Order not found'
            });
            return;
        }

        // Check if user has permission to cancel this order
        if (!isAdmin && order.userId.toString() !== userId) {
            res.status(403).json({
                success: false,
                error: 'Access denied'
            });
            return;
        }

        // Only allow cancellation of pending or processing orders
        if (!['pending', 'processing'].includes(order.orderStatus)) {
            res.status(400).json({
                success: false,
                error: 'Order cannot be cancelled at this stage'
            });
            return;
        }

        // Update order status to cancelled
        order.orderStatus = 'cancelled';
        await order.save();

        res.status(200).json({
            success: true,
            data: order,
            message: 'Order cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to cancel order'
        });
    }
};

// Delete order (admin only)
export const deleteOrder = async (
    req: AuthRequest,
    res: Response<ApiResponse<void>>
): Promise<void> => {
    try {
        const { id } = req.params;

        const order = await OrderModel.findById(id);
        if (!order) {
            res.status(404).json({
                success: false,
                error: 'Order not found'
            });
            return;
        }

        // Delete the order
        await OrderModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete order'
        });
    }
};

export default {
    createOrder,
    getAllOrders,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    deleteOrder
}; 