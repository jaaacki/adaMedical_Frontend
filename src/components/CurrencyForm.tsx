'use client';

import React, { useState, useEffect } from 'react';
import { Currency } from '@/services/currencyService';

interface CurrencyFormProps {
  currency?: Currency; // If provided, we're editing; otherwise, creating new
  onSubmit: (data: Currency) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function CurrencyForm({ currency, onSubmit, onCancel, isLoading }: CurrencyFormProps) {
  const [formData, setFormData] = useState<Currency>({
    code: '',
    name: '',
    symbol: '',
    is_active: true
  });
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currency) {
      setFormData(currency);
      setIsEditing(true);
    }
  }, [currency]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' 
        ? (e.target as HTMLInputElement).checked 
        : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.code.trim()) {
      setError('Currency code is required');
      return;
    }
    
    if (!formData.name.trim()) {
      setError('Currency name is required');
      return;
    }
    
    if (!formData.symbol.trim()) {
      setError('Currency symbol is required');
      return;
    }
    
    setError('');
    
    try {
      await onSubmit(formData);
    } catch (err: any) {
      setError(err.message || 'Failed to save currency');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700">
          Currency Code
        </label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="e.g., USD"
          disabled={isLoading || isEditing} // Currency code cannot be changed when editing
          maxLength={3}
        />
        {isEditing && (
          <p className="mt-1 text-sm text-gray-500">
            Currency code cannot be changed after creation.
          </p>
        )}
      </div>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Currency Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="e.g., US Dollar"
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
          Currency Symbol
        </label>
        <input
          type="text"
          id="symbol"
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="e.g., $"
          disabled={isLoading}
          maxLength={5}
        />
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_active"
          name="is_active"
          checked={formData.is_active}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          disabled={isLoading}
        />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
          Active
        </label>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update Currency' : 'Create Currency'}
        </button>
      </div>
    </form>
  );
}