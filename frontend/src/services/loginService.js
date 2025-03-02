import axios from 'axios'
const baseUrl = 'http://localhost:3000/api/login'

export const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }