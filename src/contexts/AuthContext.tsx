'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555/api/v1';

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
  logout: () => void;
  error: string | null;
}

// Create context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  error: null
});

// Debug function
function debugLog(message: string, data?: any) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
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
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        debugLog("Checking auth with token");
        const response = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const userData = response.data;
        debugLog("User data from API:", userData);
        
        // Ensure user data has correct structure
        setUser(userData);
        setIsAuthenticated(true);
        
        // Debug user role
        if (userData?.role?.name) {
          debugLog(`User role: ${userData.role.name}`);
        } else {
          debugLog("User has no role");
        }
      } catch (err) {
        debugLog("Auth check error:", err);
        localStorage.removeItem('token');
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
      debugLog(`Logging in: ${email}`);
      const response = await axios.post(`${API_URL}/users/login`, { email, password });
      
      let token = null;
      if (response.data.access_token) {
        token = response.data.access_token;
      } else if (response.data.token) {
        token = response.data.token;
      } else {
        throw new Error("Invalid response format");
      }
      
      localStorage.setItem('token', token);
      
      // Fetch user data
      const userResponse = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = userResponse.data;
      debugLog("User data after login:", userData);
      
      setUser(userData);
      setIsAuthenticated(true);
      
      router.push('/dashboard');
    } catch (err: any) {
      debugLog("Login error:", err);
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}