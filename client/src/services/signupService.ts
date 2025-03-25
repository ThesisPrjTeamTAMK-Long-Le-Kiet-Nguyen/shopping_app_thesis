import { authService } from './authService';
import type { Credentials } from '../types';

export async function signup(credentials: Credentials): Promise<{ success: boolean }> {
  return authService.signup(credentials.email, credentials.password);
}

export default { signup };
