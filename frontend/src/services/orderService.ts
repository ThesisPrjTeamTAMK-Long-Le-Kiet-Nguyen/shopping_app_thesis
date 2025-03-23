import axios from 'axios';
import { ApiResponse, Order } from '../types';

const baseUrl = 'http://localhost:3000/orders';

// Function to get the token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

const getConfig = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

// Create a new order
export async function createOrder(orderData: {
  receiverName: string;
  phoneNumber: string;
  address: string;
  note?: string;
  paymentMethod: 'cod' | 'online';
}): Promise<ApiResponse<Order>> {
  try {
    const response = await axios.post(baseUrl, orderData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to create order:', error);
    throw error;
  }
}

// Get user's orders
export async function getUserOrders(): Promise<ApiResponse<Order[]>> {
  try {
    const response = await axios.get(`${baseUrl}/user`, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user orders:', error);
    throw error;
  }
}

// Get specific order by ID
export async function getOrderById(orderId: string): Promise<ApiResponse<Order>> {
  try {
    const response = await axios.get(`${baseUrl}/${orderId}`, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch order:', error);
    throw error;
  }
}

// Cancel an order
export async function cancelOrder(orderId: string): Promise<ApiResponse<Order>> {
  try {
    const response = await axios.post(`${baseUrl}/${orderId}/cancel`, {}, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to cancel order:', error);
    throw error;
  }
}

// Admin: Get all orders
export async function getAllOrders(): Promise<ApiResponse<Order[]>> {
  try {
    const response = await axios.get(`${baseUrl}/admin/all`, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch all orders:', error);
    throw error;
  }
}

// Admin: Update order status
export async function updateOrderStatus(
  orderId: string,
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
): Promise<ApiResponse<Order>> {
  try {
    const response = await axios.put(
      `${baseUrl}/admin/${orderId}/status`,
      { orderStatus },
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw error;
  }
}

// Admin: Update payment status
export async function updatePaymentStatus(
  orderId: string,
  paymentStatus: 'pending' | 'paid' | 'failed'
): Promise<ApiResponse<Order>> {
  try {
    const response = await axios.put(
      `${baseUrl}/admin/${orderId}/payment`,
      { paymentStatus },
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update payment status:', error);
    throw error;
  }
}

// Admin: Delete order
export async function deleteOrder(orderId: string): Promise<ApiResponse<void>> {
  try {
    const response = await axios.delete(`${baseUrl}/admin/${orderId}`, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to delete order:', error);
    throw error;
  }
}

export default {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder
}; 