import axios from 'axios';
import { UserData, ApiResponse } from '../types';

// Update the base URL to match our new backend structure
const baseUrl = 'http://localhost:3000/api/users';

interface SignupResponse {
  id: string;
  username: string;
  email: string;
  role: string;
}

async function signup(userData: UserData): Promise<ApiResponse<SignupResponse>> {
  try {
    const response = await axios.post(`${baseUrl}/register`, userData);
    return response.data;
  } catch (error) {
    console.error('Failed to sign up:', error);
    throw error;
  }
}

// Using named export for better TypeScript support
export const signupService = {
  signup
};

export default signupService;
