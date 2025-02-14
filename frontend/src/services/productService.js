import axios from 'axios';

const baseUrl = 'http://localhost:3000/products';

export async function fetchData() {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}

export async function fetchRackets() {
  try {
    const response = await axios.get(`${baseUrl}/rackets`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch rackets:', error);
    throw error;
  }
}

export async function fetchShoes() {
  try {
    const response = await axios.get(`${baseUrl}/shoes`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch shoes:', error);
    throw error;
  }
}

export async function fetchStringings() {
  try {
    const response = await axios.get(`${baseUrl}/stringings`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stringings:', error);
    throw error;
  }
}

export async function fetchShuttlecocks() {
  try {
    const response = await axios.get(`${baseUrl}/shuttlecocks`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch shuttlecocks:', error);
    throw error;
  }
}

export async function fetchGrips() {
  try {
    const response = await axios.get(`${baseUrl}/grips`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch grips:', error);
    throw error;
  }
}

export async function fetchBags() {
  try {
    const response = await axios.get(`${baseUrl}/bags`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch bags:', error);
    throw error;
  }
}