import axios from 'axios'
import { Credentials, LoginResponse } from '../types'

const baseUrl = '/api/login'

export async function login(credentials: Credentials): Promise<LoginResponse> {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }