'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RoleDropdown from '@/components/RoleDropdown';
import CurrencySelector from '@/components/CurrencySelector';
import { createUser, updateUserCurrencies } from '@/services/userService';

export default function NewUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role_id: '',
    is_active: true,
    currency_context: 'SGD'
  });
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>(['SGD']);
  const [defaultCurrency, setDefaultCurrency] = useState<string>('SGD');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    
    // If no default currency is set or the default is not in the selection anymore
    if (currencies.length > 0 && (!defaultCurrency || !currencies.includes(defaultCurrency))) {
      setDefaultCurrency(currencies[0]);
      setFormData({
        ...formData,
        currency_context: currencies[0]
      });
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
      // Parse role_id as number if it's not empty
      const userData = {
        ...formData,
        role_id: formData.role_id ? parseInt(formData.role_id) : null,
        // Set the default currency as the currency_context
        currency_context: defaultCurrency
      };

      // Create the user
      const createdUser = await createUser(userData);
      
      // If we have multiple currencies selected, update the user's currencies
      if (selectedCurrencies.length > 1 || 
          (selectedCurrencies.length === 1 && selectedCurrencies[0] !== defaultCurrency)) {
        await updateUserCurrencies(createdUser.id, selectedCurrencies, defaultCurrency);
      }
      
      // Success! Redirect to users list
      router.push('/dashboard/users');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New User</h1>
        
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
                required
                minLength={8}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
              <p className="mt-1 text-sm text-gray-500">
                Password must be at least 8 characters long
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
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}