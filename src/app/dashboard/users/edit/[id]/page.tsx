'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RoleDropdown from '@/components/RoleDropdown';
import CurrencySelector from '@/components/CurrencySelector';
import { getUserById, updateUser, updateUserCurrencies } from '@/services/userService';
import { getUserCurrenciesForAdmin } from '@/services/currencyService';
import { User } from '@/lib';

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const userId = parseInt(params.id);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '', // Optional for updates
    role_id: '',
    is_active: true,
    currency_context: 'SGD'
  });
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);
  const [initialCurrencies, setInitialCurrencies] = useState<string[]>([]);
  const [defaultCurrency, setDefaultCurrency] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Fetch user data and currencies
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First fetch the user data
        const userData = await getUserById(userId);
        setUser(userData);
        
        // Set form data from user data
        setFormData({
          name: userData.name,
          email: userData.email,
          password: '',
          role_id: userData.role?.id?.toString() || '',
          is_active: userData.is_active,
          currency_context: userData.currency_context || 'SGD'
        });
        
        // Set default currency
        setDefaultCurrency(userData.currency_context || 'SGD');
        
        try {
          // Fetch user currencies
          const currencies = await getUserCurrenciesForAdmin(userId);
          const currencyCodes = currencies.map(uc => uc.currency_code);
          
          setSelectedCurrencies(currencyCodes);
          setInitialCurrencies(currencyCodes);
          
          // Find default currency from currencies
          const defaultCurrencyObj = currencies.find(uc => uc.is_default);
          if (defaultCurrencyObj) {
            setDefaultCurrency(defaultCurrencyObj.currency_code);
          }
        } catch (currencyError) {
          console.warn('Could not fetch currency data, using default currency only:', currencyError);
          // Just use the default currency from user object
          const defaultCurrency = userData.currency_context || 'SGD';
          setSelectedCurrencies([defaultCurrency]);
          setInitialCurrencies([defaultCurrency]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch user data');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    });
  };

  const handleCurrenciesChange = (currencies: string[]) => {
    setSelectedCurrencies(currencies);
    
    // If default currency is removed, set a new default
    if (currencies.length > 0 && !currencies.includes(defaultCurrency)) {
      handleDefaultCurrencyChange(currencies[0]);
    }
  };

  const handleDefaultCurrencyChange = (currency: string) => {
    setDefaultCurrency(currency);
    setFormData({
      ...formData,
      currency_context: currency
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Only include non-empty fields
      const updateData: any = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'password' && !value) {
          // Skip empty password
          return;
        }
        if (key === 'role_id' && value) {
          updateData[key] = parseInt(value);
        } else if (key === 'role_id' && !value) {
          updateData[key] = null; // Explicitly set role_id to null when empty
        } else {
          updateData[key] = value;
        }
      });

      // Update user basic info including currency_context
      await updateUser(userId, updateData);
      
      // Update user currencies in a single operation
      if (selectedCurrencies.length > 0) {
        await updateUserCurrencies(userId, selectedCurrencies, defaultCurrency);
      }
      
      // Success! Redirect to users list
      router.push('/dashboard/users');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-t-4 border-b-4 border-primary-600 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Edit User: {user?.name}
        </h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Leave blank to keep current password
              </p>
            </div>
            
            <div>
              <label htmlFor="role_id" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <RoleDropdown 
                value={formData.role_id} 
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="currencies" className="block text-sm font-medium text-gray-700">
                Currency Access
              </label>
              <div className="mt-1">
                <CurrencySelector
                  isEditing={true}
                  selectedCurrencies={selectedCurrencies}
                  onChange={handleCurrenciesChange}
                  defaultCurrency={defaultCurrency}
                  onDefaultChange={handleDefaultCurrencyChange}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Select currencies this user can access. The default currency will be used for new records.
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                Active Account
              </label>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/dashboard/users')}
                className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}