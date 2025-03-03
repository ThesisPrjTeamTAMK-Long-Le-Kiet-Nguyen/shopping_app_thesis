import axios from 'axios';
import {
  Racket, Bag, Shoe, Stringing, Grip, Shuttlecock,
  ApiResponse
} from '../types';

const baseUrl = 'http://localhost:3000/products';

// Function to get the token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper function to create config with authorization header
const getConfig = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

// Racket operations
export async function addRacket(racketData: Racket): Promise<ApiResponse<Racket>> {
  try {
    const response = await axios.post(`${baseUrl}/rackets`, racketData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to add racket:', error);
    throw error;
  }
}

export async function updateRacket(id: string, racketData: Partial<Racket>): Promise<ApiResponse<Racket>> {
  try {
    const response = await axios.put(`${baseUrl}/rackets/${id}`, racketData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to update racket:', error);
    throw error;
  }
}

// Bag operations
export async function addBag(bagData: Bag): Promise<ApiResponse<Bag>> {
  try {
    const response = await axios.post(`${baseUrl}/bags`, bagData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to add bag:', error);
    throw error;
  }
}

export async function updateBag(id: string, bagData: Partial<Bag>): Promise<ApiResponse<Bag>> {
  try {
    const response = await axios.put(`${baseUrl}/bags/${id}`, bagData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to update bag:', error);
    throw error;
  }
}

// Shoe operations
export async function addShoe(shoeData: Shoe): Promise<ApiResponse<Shoe>> {
  try {
    const response = await axios.post(`${baseUrl}/shoes`, shoeData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to add shoe:', error);
    throw error;
  }
}

export async function updateShoe(id: string, shoeData: Partial<Shoe>): Promise<ApiResponse<Shoe>> {
  try {
    const response = await axios.put(`${baseUrl}/shoes/${id}`, shoeData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to update shoe:', error);
    throw error;
  }
}

// Stringing operations
export async function addStringing(stringingData: Stringing): Promise<ApiResponse<Stringing>> {
  try {
    const response = await axios.post(`${baseUrl}/stringings`, stringingData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to add stringing:', error);
    throw error;
  }
}

export async function updateStringing(id: string, stringingData: Partial<Stringing>): Promise<ApiResponse<Stringing>> {
  try {
    const response = await axios.put(`${baseUrl}/stringings/${id}`, stringingData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to update stringing:', error);
    throw error;
  }
}

// Grip operations
export async function addGrip(gripData: Grip): Promise<ApiResponse<Grip>> {
  try {
    const response = await axios.post(`${baseUrl}/grips`, gripData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to add grip:', error);
    throw error;
  }
}

export async function updateGrip(id: string, gripData: Partial<Grip>): Promise<ApiResponse<Grip>> {
  try {
    const response = await axios.put(`${baseUrl}/grips/${id}`, gripData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to update grip:', error);
    throw error;
  }
}

// Shuttlecock operations
export async function addShuttlecock(shuttlecockData: Shuttlecock): Promise<ApiResponse<Shuttlecock>> {
  try {
    const response = await axios.post(`${baseUrl}/shuttlecocks`, shuttlecockData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to add shuttlecock:', error);
    throw error;
  }
}

export async function updateShuttlecock(id: string, shuttlecockData: Partial<Shuttlecock>): Promise<ApiResponse<Shuttlecock>> {
  try {
    const response = await axios.put(`${baseUrl}/shuttlecocks/${id}`, shuttlecockData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to update shuttlecock:', error);
    throw error;
  }
}

// Generic delete operation for any product type
export async function deleteProduct(productType: string, id: string): Promise<ApiResponse<void>> {
  try {
    const response = await axios.delete(`${baseUrl}/${productType}/${id}`, getConfig());
    return response.data;
  } catch (error) {
    console.error(`Failed to delete ${productType}:`, error);
    throw error;
  }
}

export default {
  addRacket,
  updateRacket,
  addBag,
  updateBag,
  addShoe,
  updateShoe,
  addStringing,
  updateStringing,
  addGrip,
  updateGrip,
  addShuttlecock,
  updateShuttlecock,
  deleteProduct
};