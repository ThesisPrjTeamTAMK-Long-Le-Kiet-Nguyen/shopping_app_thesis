export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface LoginResponse {
  success: boolean;
  data: {
    email: string;
    token: string;
    role: string;
  };
}

export interface Credentials {
  email: string;
  password: string;
}

export interface UserData extends Credentials {
  confirmPassword?: string;
}