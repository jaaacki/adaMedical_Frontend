'use client';

import React, { useState } from 'react';
import { useCurrencies } from '@/hooks/useCurrencies';
import { deleteCurrency } from '@/services/currencyService';
import CurrenciesTable from '@/components/CurrenciesTable';
import Link from 'next/link';

export default function CurrenciesPage() {
  const { currencies, loading, error, refetch } = useCurrencies();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeleteCurrency = async (currencyCode: string) => {
    try {
      await deleteCurrency(currencyCode);
      refetch(); // Refresh the currencies list after deletion
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete currency');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Currency Management</h1>
        <Link
          href="/dashboard/currencies/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Currency
        </Link>
      </div>
      
      {/* Error display */}
      {(error || deleteError) && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error?.message || deleteError}
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <CurrenciesTable 
          currencies={currencies} 
          loading={loading} 
          onDeleteCurrency={handleDeleteCurrency}
          onEditCurrency={(currency) => {
            window.location.href = `/dashboard/currencies/edit/${currency.code}`;
          }}
        />
      </div>
    </div>
  );
}