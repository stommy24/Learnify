import axios from 'axios';
import { store } from '../app/store';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';

const API_URL = process.env.REACT_APP_API_URL;

export class AuthService {
  static async login(email: string, password: string) {
    store.dispatch(loginStart());
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      store.dispatch(loginSuccess(response.data));
      return response.data;
    } catch (error) {
      store.dispatch(loginFailure(error.response?.data?.message || 'Login failed'));
      throw error;
    }
  }

  static async register(userData: {
    email: string;
    password: string;
    role: 'student' | 'parent' | 'teacher';
    firstName: string;
    lastName: string;
    yearGroup?: number;
  }) {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async resetPassword(email: string) {
    try {
      await axios.post(`${API_URL}/auth/reset-password`, { email });
    } catch (error) {
      throw error;
    }
  }

  static async updatePassword(token: string, newPassword: string) {
    try {
      await axios.post(`${API_URL}/auth/update-password`, {
        token,
        newPassword
      });
    } catch (error) {
      throw error;
    }
  }
} 