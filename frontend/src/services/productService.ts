import axios from 'axios';
import { 
  Racket, Bag, Shoe, Stringing, Grip, Shuttlecock,
  ApiResponse 
} from '../types';

const baseUrl = 'http://localhost:3000/products';

interface AllProducts {
  rackets: Racket[];
  shoes: Shoe[];
  stringings: Stringing[];
  shuttlecocks: Shuttlecock[];
  grips: Grip[];
  bags: Bag[];
}

export async function fetchData(): Promise<ApiResponse<AllProducts>> {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}

export async function fetchRackets(): Promise<ApiResponse<Racket[]>> {
  try {
    const response = await axios.get(`${baseUrl}/rackets`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch rackets:', error);
    throw error;
  }
}

export async function fetchShoes(): Promise<ApiResponse<Shoe[]>> {
  try {
    const response = await axios.get(`${baseUrl}/shoes`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch shoes:', error);
    throw error;
  }
}

export async function fetchStringings(): Promise<ApiResponse<Stringing[]>> {
  try {
    const response = await axios.get(`${baseUrl}/stringings`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stringings:', error);
    throw error;
  }
}

export async function fetchShuttlecocks(): Promise<ApiResponse<Shuttlecock[]>> {
  try {
    const response = await axios.get(`${baseUrl}/shuttlecocks`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch shuttlecocks:', error);
    throw error;
  }
}

export async function fetchGrips(): Promise<ApiResponse<Grip[]>> {
  try {
    const response = await axios.get(`${baseUrl}/grips`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch grips:', error);
    throw error;
  }
}

export async function fetchBags(): Promise<ApiResponse<Bag[]>> {
  try {
    const response = await axios.get(`${baseUrl}/bags`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch bags:', error);
    throw error;
  }
}

export default {
  fetchData,
  fetchRackets,
  fetchShoes,
  fetchStringings,
  fetchShuttlecocks,
  fetchGrips,
  fetchBags
};