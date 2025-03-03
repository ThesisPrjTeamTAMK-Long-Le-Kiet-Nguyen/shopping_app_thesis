import axios from 'axios';

const baseUrl = 'http://localhost:3000/products';

// Function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to create config with authorization header
const getConfig = () => {
  return {
    headers: { Authorization: `Bearer ${getToken()}` }
  };
};

// Racket operations
export async function addRacket(racketData) {
  try {
    const response = await axios.post(`${baseUrl}/rackets/add`, racketData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to add racket:', error);
    throw error;
  }
}

export async function updateRacket(id, racketData) {
  try {
    const response = await axios.put(`${baseUrl}/rackets/${id}`, racketData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to update racket:', error);
    throw error;
  }
}

// Bag operations
export async function addBag(bagData) {
  try {
    const response = await axios.post(`${baseUrl}/bags/add`, bagData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to add bag:', error);
    throw error;
  }
}

export async function updateBag(id, bagData) {
  try {
    const response = await axios.put(`${baseUrl}/bags/${id}`, bagData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to update bag:', error);
    throw error;
  }
}

// Shoe operations
export async function addShoe(shoeData) {
  try {
    const response = await axios.post(`${baseUrl}/shoes/add`, shoeData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to add shoe:', error);
    throw error;
  }
}

export async function updateShoe(id, shoeData) {
  try {
    const response = await axios.put(`${baseUrl}/shoes/${id}`, shoeData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to update shoe:', error);
    throw error;
  }
}

// Stringing operations
export async function addStringing(stringingData) {
  try {
    const response = await axios.post(`${baseUrl}/stringings/add`, stringingData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to add stringing:', error);
    throw error;
  }
}

export async function updateStringing(id, stringingData) {
  try {
    const response = await axios.put(`${baseUrl}/stringings/${id}`, stringingData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to update stringing:', error);
    throw error;
  }
}

// Grip operations
export async function addGrip(gripData) {
  try {
    const response = await axios.post(`${baseUrl}/grips/add`, gripData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to add grip:', error);
    throw error;
  }
}

export async function updateGrip(id, gripData) {
  try {
    const response = await axios.put(`${baseUrl}/grips/${id}`, gripData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to update grip:', error);
    throw error;
  }
}

// Shuttlecock operations
export async function addShuttlecock(shuttlecockData) {
  try {
    const response = await axios.post(`${baseUrl}/shuttlecocks/add`, shuttlecockData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to add shuttlecock:', error);
    throw error;
  }
}

export async function updateShuttlecock(id, shuttlecockData) {
  try {
    const response = await axios.put(`${baseUrl}/shuttlecocks/${id}`, shuttlecockData, getConfig());
    return response.data;
  } catch (error) {
    console.error('Failed to update shuttlecock:', error);
    throw error;
  }
}

// Generic delete operation for any product type
export async function deleteProduct(productType, id) {
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