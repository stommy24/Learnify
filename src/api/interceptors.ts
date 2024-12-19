import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { AuthService } from '../services/auth/AuthService';
import { APIErrorResponse } from './types/errors';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const authService = new AuthService();
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const auth = await authService.refreshToken(refreshToken);
          originalRequest.headers.Authorization = `Bearer ${auth.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Handle refresh token failure
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    const apiError = new APIErrorResponse({
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      message: error.response?.data?.message || 'An unknown error occurred',
      status: error.response?.status || 500,
      details: error.response?.data?.details,
    });

    return Promise.reject(apiError);
  }
);

export { api }; 