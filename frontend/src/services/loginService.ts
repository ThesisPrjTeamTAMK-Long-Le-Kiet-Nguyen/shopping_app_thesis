import axios from 'axios'
import { Credentials, ApiResponse } from '../types'

const baseUrl = 'http://localhost:3000/api/login'

export async function login(credentials: Credentials): Promise<ApiResponse<{ token: string; username: string; role: string }>> {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }