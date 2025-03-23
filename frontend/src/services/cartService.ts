import axios from 'axios';
import { CartItem, ApiResponse, Cart } from '../types';

const baseUrl = 'http://localhost:3000/carts';

// Function to get the token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token'); // Assuming the token is stored in localStorage
};

const getConfig = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

// Add an item to the cart
export async function addToCart(item: CartItem): Promise<ApiResponse<Cart>> {
  try {
    const response = await axios.post(baseUrl, item, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    throw error;
  }
}

// Get the user's cart
export async function getCart(): Promise<ApiResponse<Cart>> {
  try {
    const response = await axios.get(baseUrl, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    throw error;
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(
  itemId: string,
  quantity: number
): Promise<ApiResponse<Cart>> {
  try {
    const response = await axios.put(
      `${baseUrl}/${itemId}`,
      { quantity },
      getConfig()
    );
    return response.data;
  } catch (error) {
    console.error('Failed to update cart item quantity:', error);
    throw error;
  }
}

// Remove an item from the cart
export async function removeFromCart(itemId: string): Promise<ApiResponse<void>> {
  try {
    const response = await axios.delete(`${baseUrl}/${itemId}`, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
    throw error;
  }
}

export async function clearCart(): Promise<ApiResponse<void>> {
  try {
    const response = await axios.delete(baseUrl, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to clear cart:', error);
    throw error;
  }
}

export default { 
  addToCart, 
  getCart, 
  removeFromCart,
  updateCartItemQuantity,
  clearCart 
}; 