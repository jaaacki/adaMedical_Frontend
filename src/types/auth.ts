import { User } from '@/lib';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  access_token: string;
  refresh_token?: string;
}

export interface RefreshTokenResponse {
  status: string;
  message: string;
  access_token: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}