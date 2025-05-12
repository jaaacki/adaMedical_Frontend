// src/components/UserCurrencyManager.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { getAllCurrencies, getUserCurrenciesForAdmin, assignCurrencyToUser } from '@/services/currencyService';

interface UserCurrencyManagerProps {
  userId: number;
}

export default function UserCurrencyManager({ userId }: UserCurrencyManagerProps) {
  const [availableCurrencies, setAvailableCurrencies] = useState([]);
  const [assignedCurrencies, setAssignedCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [allCurrencies, userCurrencies] = await Promise.all([
          getAllCurrencies(),
          getUserCurrenciesForAdmin(userId)
        ]);
        
        setAvailableCurrencies(allCurrencies);
        setAssignedCurrencies(userCurrencies);
      } catch (err: any) {
        setError(err.message || 'Failed to load currencies');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [userId]);
  
  // Handle assigning currency to user
  const handleAssignCurrency = async () => {
    if (!selectedCurrency) return;
    
    try {
      await assignCurrencyToUser(userId, selectedCurrency);
      
      // Refresh assigned currencies
      const userCurrencies = await getUserCurrenciesForAdmin(userId);
      setAssignedCurrencies(userCurrencies);
      setSelectedCurrency('');
    } catch (err: any) {
      setError(err.message || 'Failed to assign currency');
    }
  };
  
  // Render loading state
  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }
  
  // Filter out already assigned currencies
  const unassignedCurrencies = availableCurrencies.filter(
    currency => !assignedCurrencies.some(ac => ac.currency_code === currency.code)
  );
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Currency Access</h3>
      
      {error && (
        <div className="bg-red-50 p-4 rounded text-red-600">
          {error}
        </div>
      )}
      
      {/* List of assigned currencies */}
      <div className="bg-white shadow rounded-md overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {assignedCurrencies.map(item => (
            <li key={item.id} className="px-4 py-3 flex justify-between items-center">
              <div>
                <span className="font-medium">{item.currency.code}</span>
                <span className="ml-2 text-sm text-gray-500">{item.currency.name}</span>
                {item.is_default && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSetDefault(item.currency_code)}
                  disabled={item.is_default}
                  className={`px-2 py-1 text-xs rounded ${
                    item.is_default 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  Set Default
                </button>
                <button
                  onClick={() => handleRemoveCurrency(item.id)}
                  disabled={item.is_default}
                  className={`px-2 py-1 text-xs rounded ${
                    item.is_default
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
          
          {assignedCurrencies.length === 0 && (
            <li className="px-4 py-3 text-gray-500 text-center">
              No currencies assigned yet
            </li>
          )}
        </ul>
      </div>
      
      {/* Assign new currency */}
      <div className="flex space-x-2">
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select currency to assign...</option>
          {unassignedCurrencies.map(currency => (
            <option key={currency.code} value={currency.code}>
              {currency.code} - {currency.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleAssignCurrency}
          disabled={!selectedCurrency}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          Assign
        </button>
      </div>
    </div>
  );
}