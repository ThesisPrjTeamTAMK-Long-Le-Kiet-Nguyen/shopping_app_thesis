import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  email: string | null;
  role: string | null;
  updateAuth: (token: string | null, email: string | null, role: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    email: localStorage.getItem('email'),
    role: localStorage.getItem('role'),
  });

  const updateAuth = (token: string | null, email: string | null, role: string | null) => {
    setAuth({ token, email, role });
  };

  return (
    <AuthContext.Provider value={{ ...auth, updateAuth }}>
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