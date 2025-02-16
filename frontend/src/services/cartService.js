import axios from 'axios';

const baseUrl = 'http://localhost:3000/carts';

// Function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem('token'); // Assuming the token is stored in localStorage
};

// Add an item to the cart
export async function addToCart(item) {
  try {
    const response = await axios.post(baseUrl, item, {
      headers: { Authorization: `Bearer ${getToken()}` } // Include the token in the headers
    });
    return response.data;
  } catch (error) {
    console.error('Failed to add item to cart:', error);
    throw error;
  }
}

// Get the user's cart
export async function getCart() {
  try {
    const response = await axios.get(baseUrl, {
      headers: { Authorization: `Bearer ${getToken()}` } // Include the token in the headers
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    throw error;
  }
}

// Remove an item from the cart
export async function removeFromCart(itemId) {
  try {
    const response = await axios.delete(`${baseUrl}/${itemId}`, {
      headers: { Authorization: `Bearer ${getToken()}` } // Include the token in the headers
    });
    return response.data;
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
    throw error;
  }
}

export default { addToCart, getCart, removeFromCart }; 