export interface ApiResponse<T> {
  role: string;
  username: string;
  token: string;
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Config {
  MONGODB_URI: string;
  PORT: number;
  JWT_SECRET: string;
} 