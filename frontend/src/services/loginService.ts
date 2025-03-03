import axios from 'axios'
import { Credentials } from '../types'

const baseUrl = 'http://localhost:3000/api/login'

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    username: string;
    role: string;
  };
}

export async function login(credentials: Credentials): Promise<LoginResponse> {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }