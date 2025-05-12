'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555/api/v1';

// Simple user type
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

// Minimal context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  error: null
});

// Provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Debug the user state whenever it changes
  useEffect(() => {
    console.log("Current user state:", user);
  }, [user]);
  
  // Check authentication on load
  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        console.log("Found token, getting user data...");
        const { data } = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log("User data from API:", data);
        setUser(data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Auth check error:", err);
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
      console.log("Attempting login for:", email);
      const { data } = await axios.post(`${API_URL}/users/login`, { email, password });
      console.log("Login response:", data);
      
      let token = null;
      
      // Check different response formats
      if (data.access_token) {
        token = data.access_token;
      } else if (data.status === 'success' && data.access_token) {
        token = data.access_token;
      } else {
        console.error("Invalid response format:", data);
        throw new Error("Invalid response format");
      }
      
      localStorage.setItem('token', token);
      
      // Fetch user data with the token
      console.log("Getting user profile with token...");
      const userResponse = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("User profile response:", userResponse.data);
      setUser(userResponse.data);
      setIsAuthenticated(true);
      
      // Navigate to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
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