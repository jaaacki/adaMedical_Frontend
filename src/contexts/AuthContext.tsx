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

  // Check authentication on load
  useEffect(() => {
    async function checkAuth() {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsLoading(false);
          return;
        }
        
        const { data } = await axios.get(`${API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(data);
        setIsAuthenticated(true);
      } catch (err) {
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
      console.log('Attempting login with:', email);
      const { data } = await axios.post(`${API_URL}/users/login`, { email, password });
      console.log('Login response:', data);
      
      // Handle different response formats
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
      } else if (data.status === 'success' && data.access_token) {
        localStorage.setItem('token', data.access_token);
      } else {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format - missing access token');
      }
      
      // Fetch user data with the new token
      const token = localStorage.getItem('token');
      console.log('Fetching user data with token');
      const userResponse = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('User data response:', userResponse.data);
      setUser(userResponse.data);
      setIsAuthenticated(true);
      
      console.log('Redirecting to dashboard...');
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