export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface UserData extends Credentials {
  username: string;
  confirmPassword?: string;
} 