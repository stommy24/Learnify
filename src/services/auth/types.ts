export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher' | 'admin';
  yearGroup?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RegisterData extends AuthCredentials {
  firstName: string;
  lastName: string;
  role: 'student' | 'teacher';
  yearGroup?: number;
} 