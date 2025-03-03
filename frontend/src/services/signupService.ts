import axios from 'axios';
import { UserData, ApiResponse } from '../types';

const baseUrl = 'http://localhost:3000/users/register';

interface SignupResponse {
  id: string;
  username: string;
  email: string;
  role: string;
}

async function signup(userData: UserData): Promise<ApiResponse<SignupResponse>> {
  try {
    const response = await axios.post(baseUrl, userData);
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
