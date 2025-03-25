export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface AuthResponse {
  success: boolean;
  data: {
    email: string;
    token: string;
    role: UserRole;
  };
}

export interface Credentials {
  email: string;
  password: string;
}

export interface UserData extends Credentials {
  confirmPassword?: string;
}

export interface AuthState {
  token: string | null;
  email: string | null;
  role: UserRole | null;
}