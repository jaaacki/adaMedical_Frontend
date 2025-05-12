'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getAllCurrencies, getUserCurrencies, setDefaultCurrency } from '@/services/currencyService';

interface Currency {
  code: string;
  name: string;
  symbol: string;
  is_active?: boolean;
}

interface UserCurrency {
  id: number;
  currency_code: string;
  is_default: boolean;
  currency: Currency;
}

interface CurrencyMultiSelectorProps {
  selectedCurrencies?: string[];
  onChange?: (currencies: string[]) => void;
  defaultCurrency?: string;
  onDefaultChange?: (currency: string) => void;
  isEditing?: boolean;
  className?: string;
}

// This enhanced component provides both a dropdown selector for context switching
// and a multi-select interface for user editing
export default function CurrencySelector({
  selectedCurrencies,
  onChange,
  defaultCurrency,
  onDefaultChange,
  isEditing = false,
  className = ''
}: CurrencyMultiSelectorProps) {
  const { user } = useAuth();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [userCurrencies, setUserCurrencies] = useState<UserCurrency[]>([]);
  const [selected, setSelected] = useState<string[]>(selectedCurrencies || []);
  const [defaultCurrencyCode, setDefaultCurrencyCode] = useState<string>(defaultCurrency || '');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Fetch all available currencies for editing mode
  useEffect(() => {
    if (isEditing) {
      const fetchAllCurrencies = async () => {
        try {
          const data = await getAllCurrencies();
          setCurrencies(data.filter(currency => currency.is_active !== false));
          setLoading(false);
        } catch (error) {
          console.error('Error fetching all currencies:', error);
          setLoading(false);
        }
      };
      
      fetchAllCurrencies();
    }
  }, [isEditing]);
  
  // Fetch the user's assigned currencies for the dropdown
  useEffect(() => {
    if (!isEditing) {
      const fetchUserCurrencies = async () => {
        try {
          // Use the actual API client instead of direct fetch
          const data = await getUserCurrencies();
          setUserCurrencies(data);
          
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
    }
  }, [user, searchParams, isEditing]);

  // Initialize selected currencies from props
  useEffect(() => {
    if (isEditing && selectedCurrencies) {
      setSelected(selectedCurrencies);
    }
  }, [selectedCurrencies, isEditing]);

  // Initialize default currency from props
  useEffect(() => {
    if (isEditing && defaultCurrency) {
      setDefaultCurrencyCode(defaultCurrency);
    }
  }, [defaultCurrency, isEditing]);
  
  // Handle currency change in selector mode
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    
    // Update URL with the new currency parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('currency', newCurrency);
    
    // Navigate to the same page but with updated query params
    router.push(`${pathname}?${params.toString()}`);
  };
  
  // Handle currency toggle in multi-select mode
  const toggleCurrency = (code: string) => {
    let newSelected;
    if (selected.includes(code)) {
      // If this is the default currency and we're removing it,
      // we need to set a new default if possible
      if (code === defaultCurrencyCode && onDefaultChange) {
        const remaining = selected.filter(c => c !== code);
        if (remaining.length > 0) {
          setDefaultCurrencyCode(remaining[0]);
          onDefaultChange(remaining[0]);
        }
      }
      
      newSelected = selected.filter(c => c !== code);
    } else {
      newSelected = [...selected, code];
      
      // If this is the first currency and we have onDefaultChange, set it as default
      if (selected.length === 0 && onDefaultChange) {
        setDefaultCurrencyCode(code);
        onDefaultChange(code);
      }
    }
    
    setSelected(newSelected);
    if (onChange) {
      onChange(newSelected);
    }
  };
  
  // Set a currency as default in multi-select mode
  const setAsDefault = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDefaultChange && selected.includes(code)) {
      setDefaultCurrencyCode(code);
      onDefaultChange(code);
    }
  };
  
  // Helper to update selected currency (for dropdown mode)
  const setSelectedCurrency = (currencyCode: string) => {
    setSelected([currencyCode]);
    setDefaultCurrencyCode(currencyCode);
  };
  
  // Get display text for multi-select dropdown
  const getDisplayText = () => {
    if (selected.length === 0) {
      return 'Select currencies';
    }
    
    if (selected.length === 1) {
      const currencyObj = currencies.find(c => c.code === selected[0]);
      return currencyObj ? `${currencyObj.code} - ${currencyObj.name}` : selected[0];
    }
    
    return `${selected.length} currencies selected`;
  };
  
  // Don't render anything if still loading or no currencies available
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }
  
  // Single Currency dropdown mode (normal page context)
  if (!isEditing) {
    // If user only has one currency, no need for a selector
    if (userCurrencies.length <= 1) {
      return (
        <div className="px-3 py-1 text-sm bg-gray-100 rounded-md text-gray-700">
          {userCurrencies.length === 1 ? userCurrencies[0].currency_code : 'No currencies'}
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
          value={selected[0] || ''}
          onChange={handleCurrencyChange}
          className={`block w-32 py-1 px-2 text-sm border-gray-300 rounded-md shadow-sm 
                 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${className}`}
        >
          {userCurrencies.map(item => (
            <option key={item.id} value={item.currency_code}>
              {item.currency_code} {item.is_default ? '(Default)' : ''}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  // Multi-select mode (for editing user)
  return (
    <div className={`relative ${className}`}>
      <div 
        className="flex items-center justify-between border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 truncate">
          {getDisplayText()}
        </div>
        <svg 
          className={`w-5 h-5 text-gray-400 transition-transform duration-150 ${isOpen ? 'transform rotate-180' : ''}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-60 overflow-auto">
          <ul className="py-1">
            {currencies.map(currency => (
              <li 
                key={currency.code}
                className="px-3 py-2 hover:bg-gray-100 flex items-center justify-between cursor-pointer"
                onClick={() => toggleCurrency(currency.code)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selected.includes(currency.code)}
                    onChange={() => {}} // Handled by parent onClick
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2">{currency.code} - {currency.name}</span>
                </div>
                
                {selected.includes(currency.code) && (
                  <button
                    onClick={(e) => setAsDefault(currency.code, e)}
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      defaultCurrencyCode === currency.code
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-blue-50'
                    }`}
                  >
                    {defaultCurrencyCode === currency.code ? 'Default' : 'Set Default'}
                  </button>
                )}
              </li>
            ))}
            {currencies.length === 0 && (
              <li className="px-3 py-2 text-gray-500">No currencies available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}