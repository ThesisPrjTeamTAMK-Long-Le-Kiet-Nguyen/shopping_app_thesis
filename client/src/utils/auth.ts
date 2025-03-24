import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Add this package if not already installed

interface TokenPayload {
  email: string;
  role: string;
  exp: number;
}

export const AUTH_TOKEN_KEY = 'auth_token';

export const authUtils = {
  setToken(token: string) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    this.setAuthHeader(token);
  },

  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  removeToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
  },

  setAuthHeader(token: string | null) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  getTokenPayload(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<TokenPayload>(token);
    } catch {
      return null;
    }
  }
};

// Axios interceptor for handling auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authUtils.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
); 