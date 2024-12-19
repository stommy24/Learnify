import { api } from '../interceptors';
import { API_ENDPOINTS } from '../endpoints';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  user: any;
  token: string;
  refreshToken: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, { token, password });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
    return response.data;
  }
}

export const authService = new AuthService(); 