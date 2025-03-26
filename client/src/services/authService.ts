import axios from 'axios';
import type { AuthResponse, AuthState, UserRole } from '../types/auth';

class AuthService {
  private static instance: AuthService;
  private baseUrl = '/api';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Get current auth state
  public getAuthState(): AuthState {
    return {
      token: localStorage.getItem('token'),
      email: localStorage.getItem('email'),
      role: (localStorage.getItem('role') as UserRole) || null,
    };
  }

  // Set auth state
  private setAuthState(authData: AuthState): void {
    localStorage.setItem('token', authData.token || '');
    localStorage.setItem('email', authData.email || '');
    localStorage.setItem('role', authData.role || '');
  }

  // Clear auth state
  public clearAuthState(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  }

  // Get auth headers for API requests
  public getAuthHeaders(): { Authorization: string } | {} {
    const token = this.getAuthState().token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Login
  public async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post<AuthResponse>(`${this.baseUrl}/login`, {
        email,
        password,
      });

      if (response.data.success) {
        this.setAuthState(response.data.data);
      }

      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  // Logout
  public logout(): void {
    this.clearAuthState();
  }

  // Check if user is authenticated
  public isAuthenticated(): boolean {
    return !!this.getAuthState().token;
  }

  // Check if user has specific role
  public hasRole(role: UserRole): boolean {
    return this.getAuthState().role === role;
  }

  // Check if user has any of the specified roles
  public hasAnyRole(roles: UserRole[]): boolean {
    const userRole = this.getAuthState().role;
    return roles.includes(userRole || 'customer');
  }
}

export const authService = AuthService.getInstance(); 