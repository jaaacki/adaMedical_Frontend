// User related types
export interface User {
  id: number;
  name: string;
  email: string;
  role?: Role;
  is_active: boolean;
  currency_context?: string;
  has_password: boolean;
  is_sso_user: boolean;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: number;
  name: string;
}

// Authentication related types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

// API response types
export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
  };
}