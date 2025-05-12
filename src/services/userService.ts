// src/services/userService.ts
import apiClient from '@/lib/api-client';
import { User } from '@/lib';

// Define response type for users list
export interface UsersListResponse {
  items: User[];
  pagination?: {
    page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
  };
}

/**
 * Fetch all users (admin only)
 */
export const getUsers = async (): Promise<UsersListResponse> => {
  try {
    const response = await apiClient.get('/users/');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get a specific user by ID
 */
export const getUserById = async (userId: number): Promise<User> => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
};

/**
 * Delete a user (admin only)
 */
export const deleteUser = async (userId: number): Promise<void> => {
  try {
    await apiClient.delete(`/users/${userId}`);
  } catch (error) {
    console.error(`Error deleting user with ID ${userId}:`, error);
    throw error;
  }
};

/**
 * Update a user (admin only)
 */
export const updateUser = async (userId: number, userData: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    throw error;
  }
};

/**
 * Create a new user (admin only)
 */
export const createUser = async (userData: any): Promise<User> => {
  try {
    const response = await apiClient.post('/users/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};