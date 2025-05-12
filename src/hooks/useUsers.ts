// src/hooks/useUsers.ts
import { useState, useEffect } from 'react';
import { User } from '@/lib';
import { getUsers, UsersListResponse } from '@/services/userService';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
  pagination?: {
    page: number;
    page_size: number;
    total_pages: number;
    total_items: number;
  };
}

export const useUsers = (): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<UseUsersReturn['pagination']>();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response: UsersListResponse = await getUsers();
      setUsers(response.items || []);
      
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    pagination
  };
};