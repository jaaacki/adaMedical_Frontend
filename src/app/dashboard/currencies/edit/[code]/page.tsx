'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CurrencyForm from '@/components/CurrencyForm';
import { getCurrencyByCode, updateCurrency, Currency } from '@/services/currencyService';

interface EditCurrencyPageProps {
  params: {
    code: string;
  };
}

export default function EditCurrencyPage({ params }: EditCurrencyPageProps) {
  const currencyCode = params.code;
  const router = useRouter();
  const [currency, setCurrency] = useState<Currency | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const data = await getCurrencyByCode(currencyCode);
        setCurrency(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch currency');
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCurrency();
  }, [currencyCode]);

  const handleSubmit = async (currencyData: Currency) => {
    setLoading(true);
    setError(null);

    try {
      // Only update fields that can change, not the code itself
      const updateData = {
        name: currencyData.name,
        symbol: currencyData.symbol,
        is_active: currencyData.is_active
      };

      await updateCurrency(currencyCode, updateData);
      router.push('/dashboard/currencies');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update currency');
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

  if (!currency && !error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">Currency not found.</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push('/dashboard/currencies')}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Back to Currencies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Edit Currency: {currency?.code} - {currency?.name}
        </h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="bg-white shadow rounded-lg p-6">
          {currency && (
            <CurrencyForm 
              currency={currency}
              onSubmit={handleSubmit}
              onCancel={() => router.push('/dashboard/currencies')}
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}