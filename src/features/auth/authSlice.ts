import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'admin' | 'teacher' | 'student';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  lastLogin?: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  resetToken: string | null;
  resetTokenExpiry: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  resetToken: null,
  resetTokenExpiry: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: UserProfile; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setResetToken: (
      state,
      action: PayloadAction<{ token: string; expiry: string } | null>
    ) => {
      state.resetToken = action.payload?.token ?? null;
      state.resetTokenExpiry = action.payload?.expiry ?? null;
    }
  }
});

export const {
  setCredentials,
  logout,
  setLoading,
  setError,
  setResetToken
} = authSlice.actions;

export default authSlice.reducer; 