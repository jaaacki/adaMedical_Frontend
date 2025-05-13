'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api-client';

// API URL - removed as we'll use the apiClient configuration
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555/api/v1';

// User type
interface User {
  id: number;
  name: string;
  email: string;
  role?: {
    id: number;
    name: string;
  };
  is_active?: boolean;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => void;
  error: string | null;
}

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  loginWithGoogle: () => {},
  logout: () => {},
  error: null
});

// Enhanced debug function
function debugLog(message: string, data?: any) {
  if (typeof window !== 'undefined') {
    console.log(`[Auth] ${message}`, data || '');
  }
}

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Check authentication on load
  useEffect(() => {
    async function checkAuth() {
      try {
        // Check for access token
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          debugLog("No access token found in localStorage");
          setIsLoading(false);
          return;
        }
        
        debugLog("Access token found, checking authentication");
        
        try {
          // Use apiClient instead of direct axios call
          const response = await apiClient.get('/users/me');
          
          const userData = response.data;
          debugLog("User data fetched from API:", userData);
          
          // Debug role information specifically
          if (userData?.role) {
            debugLog("Role from API:", userData.role);
            debugLog("Role ID:", userData.role.id);
            debugLog("Role Name:", userData.role.name);
          } else {
            debugLog("No role information in user data");
          }
          
          // Store the user data
          setUser(userData);
          setIsAuthenticated(true);
          
        } catch (apiError: any) {
          debugLog("API error during auth check:", apiError.message);
          debugLog("API error status:", apiError.response?.status);
          debugLog("API error data:", apiError.response?.data);
          
          // Clear invalid tokens
          if (apiError.response?.status === 401) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }
      } catch (err) {
        debugLog("General error during auth check:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      debugLog(`Attempting login for email: ${email}`);
      
      // Use apiClient instead of direct axios call
      const response = await apiClient.post('/users/login', { email, password });
      debugLog("Login API response:", response.data);
      
      // Extract tokens
      let accessToken = null;
      let refreshToken = null;
      
      if (response.data.access_token) {
        accessToken = response.data.access_token;
        refreshToken = response.data.refresh_token;
        debugLog("Tokens extracted from response");
      } else if (response.data.token) {
        accessToken = response.data.token;
        debugLog("Legacy token format detected");
      } else {
        throw new Error("Invalid response format - no token found");
      }
      
      // Store tokens in localStorage
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      debugLog("Tokens stored in localStorage");
      
      // Fetch user data using apiClient
      const userResponse = await apiClient.get('/users/me');
      const userData = userResponse.data;
      debugLog("User data after login:", userData);
      
      // Debug role information
      if (userData?.role) {
        debugLog("Role info:", userData.role);
        debugLog("Role name:", userData.role.name);
        debugLog("Is admin check:", userData.role.name === 'Admin' || userData.role.name === 'Administrator');
      } else {
        debugLog("No role information in user data");
      }
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      
      // Navigate to dashboard
      router.push('/dashboard');
      
    } catch (err: any) {
      debugLog("Login error:", err);
      debugLog("Error response:", err.response?.data);
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google login function
  const loginWithGoogle = () => {
    debugLog("Initiating Google login");
    // Store current path for redirect after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth/login') {
      localStorage.setItem('redirect_after_login', currentPath);
    }
    
    // Get the API URL from apiClient for Google auth
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555/api/v1';
    
    // Redirect to Google auth endpoint
    window.location.href = `${apiBaseUrl}/auth/google/login`;
  };

  // Logout function
  const logout = () => {
    debugLog("Logging out user");
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, loginWithGoogle, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}