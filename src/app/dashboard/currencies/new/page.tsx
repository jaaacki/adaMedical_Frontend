'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import CurrencyForm from '@/components/CurrencyForm';
import { createCurrency, Currency } from '@/services/currencyService';

export default function NewCurrencyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (currencyData: Currency) => {
    setLoading(true);
    setError(null);

    try {
      await createCurrency(currencyData);
      router.push('/dashboard/currencies');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create currency');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Create New Currency</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="bg-white shadow rounded-lg p-6">
          <CurrencyForm 
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard/currencies')}
            isLoading={loading}
          />
        </div>
      </div>
    </div>
  );
}