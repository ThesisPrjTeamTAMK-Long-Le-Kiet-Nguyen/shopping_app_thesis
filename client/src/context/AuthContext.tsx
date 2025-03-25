import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService } from '../services/authService';
import type { AuthResponse, AuthState, UserRole } from '../types/auth';

interface AuthContextType {
  token: string | null;
  email: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  signup: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(authService.getAuthState());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize auth state from storage
    setAuth(authService.getAuthState());
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      if (response.success) {
        setAuth(response.data);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.signup(email, password);
      if (response.success) {
        setAuth(response.data);
      }
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authService.logout();
    setAuth(authService.getAuthState());
  };

  const value: AuthContextType = {
    ...auth,
    isLoading,
    isAuthenticated: authService.isAuthenticated(),
    hasRole: authService.hasRole.bind(authService),
    hasAnyRole: authService.hasAnyRole.bind(authService),
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};