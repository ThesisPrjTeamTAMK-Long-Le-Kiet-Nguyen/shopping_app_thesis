import { authService } from './authService';
import type { Credentials, AuthResponse } from '../types/auth';

export async function login(credentials: Credentials): Promise<AuthResponse> {
  return authService.login(credentials.email, credentials.password);
}

export default { login };