import axios from 'axios';
const baseUrl = 'http://localhost:3000/users/register';

const signup = async userData => {
  const response = await axios.post(baseUrl, userData);
  return response.data;
}

export default { signup };
