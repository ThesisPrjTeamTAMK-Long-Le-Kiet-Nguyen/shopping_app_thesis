import axios from 'axios';
import type { UserData } from '../types/auth';

interface SignupResponse {
  success: boolean;
  message: string;
}

async function signup(userData: UserData): Promise<SignupResponse> {
  try {
    const response = await axios.post('/api/users/register', userData);
    return response.data;
  } catch (error) {
    console.error('Failed to sign up:', error);
    throw error;
  }
}

export const signupService = {
  signup
};

export default signupService;
