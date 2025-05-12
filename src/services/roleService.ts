// src/services/roleService.ts
import apiClient from '@/lib/api-client';
import { Role } from '@/lib';

/**
 * Fetch all roles
 */
export const getRoles = async (): Promise<Role[]> => {
  try {
    const response = await apiClient.get('/users/roles');
    return response.data;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
};

/**
 * Get a specific role by ID
 */
export const getRoleById = async (roleId: number): Promise<Role> => {
  try {
    const response = await apiClient.get(`/users/roles/${roleId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching role with ID ${roleId}:`, error);
    throw error;
  }
};

/**
 * Create a new role
 */
export const createRole = async (roleName: string): Promise<Role> => {
  try {
    const response = await apiClient.post('/users/roles', { name: roleName });
    return response.data;
  } catch (error) {
    console.error('Error creating role:', error);
    throw error;
  }
};

/**
 * Update a role
 */
export const updateRole = async (roleId: number, roleName: string): Promise<Role> => {
  try {
    const response = await apiClient.put(`/users/roles/${roleId}`, { name: roleName });
    return response.data;
  } catch (error: any) {
    // Extract the API error message when available
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          `Error ${statusCode}: Failed to update role`;
      
      // Create a more descriptive error
      const enhancedError = new Error(errorMessage);
      if (statusCode === 403) {
        enhancedError.message = "You don't have permission to update this role. Some roles like 'Admin' may be protected.";
      } else if (statusCode === 409) {
        enhancedError.message = "A role with this name already exists.";
      }
      
      throw enhancedError;
    }
    
    console.error(`Error updating role with ID ${roleId}:`, error);
    throw error;
  }
};

/**
 * Delete a role
 */
export const deleteRole = async (roleId: number): Promise<void> => {
  try {
    await apiClient.delete(`/users/roles/${roleId}`);
  } catch (error: any) {
    // Extract the API error message when available
    if (error.response) {
      const statusCode = error.response.status;
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          `Error ${statusCode}: Failed to delete role`;
      
      // Create a more descriptive error
      const enhancedError = new Error(errorMessage);
      if (statusCode === 403) {
        enhancedError.message = "Cannot delete this role. Some roles like 'Admin' cannot be deleted.";
      } else if (statusCode === 400) {
        enhancedError.message = "Cannot delete this role because it is currently assigned to users.";
      }
      
      throw enhancedError;
    }
    
    console.error(`Error deleting role with ID ${roleId}:`, error);
    throw error;
  }
};