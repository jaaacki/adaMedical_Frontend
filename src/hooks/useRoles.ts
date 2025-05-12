// src/hooks/useRoles.ts
import { useState, useEffect } from 'react';
import { Role } from '@/lib';
import { getRoles, deleteRole as deleteRoleService } from '@/services/roleService';

interface UseRolesReturn {
  roles: Role[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  deleteRole: (roleId: number) => Promise<void>;
}

export const useRoles = (): UseRolesReturn => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const rolesData = await getRoles();
      setRoles(rolesData);
    } catch (err) {
      console.error('Error in useRoles hook:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const deleteRole = async (roleId: number) => {
    try {
      await deleteRoleService(roleId);
      // After successful deletion, refetch the roles
      fetchRoles();
    } catch (err) {
      console.error('Error deleting role:', err);
      throw err;
    }
  };

  return {
    roles,
    loading,
    error,
    refetch: fetchRoles,
    deleteRole,
  };
};