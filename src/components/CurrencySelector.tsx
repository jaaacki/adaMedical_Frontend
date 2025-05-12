'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface UserCurrency {
  id: number;
  currency_code: string;
  is_default: boolean;
  currency: Currency;
}

// This component provides a dropdown to switch between currencies
// It automatically updates the URL with a ?currency=XXX parameter when changed
export default function CurrencySelector() {
  const { user } = useAuth();
  const [currencies, setCurrencies] = useState<UserCurrency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Fetch the user's assigned currencies
  useEffect(() => {
    const fetchUserCurrencies = async () => {
      try {
        // Use the API client to fetch currencies
        const response = await fetch('/api/currencies/user/currencies', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch currencies');
        }
        
        const data = await response.json();
        setCurrencies(data);
        
        // Check if there's a currency parameter in the URL
        const currencyParam = searchParams.get('currency');
        
        // Determine which currency should be selected
        if (currencyParam && data.some(c => c.currency_code === currencyParam)) {
          setSelectedCurrency(currencyParam);
        } else {
          // Use default currency or first available
          const defaultCurrency = data.find(c => c.is_default);
          if (defaultCurrency) {
            setSelectedCurrency(defaultCurrency.currency_code);
          } else if (data.length > 0) {
            setSelectedCurrency(data[0].currency_code);
          }
        }
      } catch (error) {
        console.error('Error fetching user currencies:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchUserCurrencies();
    }
  }, [user, searchParams]);
  
  // Handle currency change
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    
    // Update URL with the new currency parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('currency', newCurrency);
    
    // Navigate to the same page but with updated query params
    router.push(`${pathname}?${params.toString()}`);
  };
  
  // Don't render anything if still loading or no currencies available
  if (loading || currencies.length === 0) {
    return null;
  }
  
  // If user only has one currency, no need for a selector
  if (currencies.length === 1) {
    return (
      <div className="px-3 py-1 text-sm bg-gray-100 rounded-md text-gray-700">
        {currencies[0].currency_code}
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="currency-selector" className="text-sm text-gray-700">
        Currency:
      </label>
      <select
        id="currency-selector"
        value={selectedCurrency}
        onChange={handleCurrencyChange}
        className="block w-24 py-1 px-2 text-sm border-gray-300 rounded-md shadow-sm 
                 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
      >
        {currencies.map(item => (
          <option key={item.id} value={item.currency_code}>
            {item.currency_code} {item.is_default ? '(Default)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}