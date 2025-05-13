'use client';

import React from 'react';
import { Currency } from '@/services/currencyService';

interface CurrenciesTableProps {
  currencies: Currency[];
  loading: boolean;
  onEditCurrency?: (currency: Currency) => void;
  onDeleteCurrency?: (currencyCode: string) => void;
}

export default function CurrenciesTable({ 
  currencies, 
  loading, 
  onEditCurrency, 
  onDeleteCurrency 
}: CurrenciesTableProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-3 py-4 px-6">
        <div className="h-8 bg-gray-200 rounded"></div>
        {[...Array(3)].map((_, index) => (
          <div key={index} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (currencies.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">No currencies found.</p>
        <p className="text-gray-400 text-sm mt-2">Add a new currency to get started.</p>
      </div>
    );
  }

  // Handle currency deletion with confirmation
  const handleDeleteClick = (currency: Currency) => {
    // Check if the currency is protected (SGD, IDR are system currencies)
    const isProtectedCurrency = ['SGD', 'IDR'].includes(currency.code);
    
    if (isProtectedCurrency) {
      alert(`Cannot delete the "${currency.code}" currency as it is a protected system currency.`);
      return;
    }
    
    // Ask for confirmation
    if (window.confirm(`Are you sure you want to delete the currency "${currency.code}"?`)) {
      onDeleteCurrency && onDeleteCurrency(currency.code);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Code
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Symbol
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currencies.map((currency) => {
            const isProtected = ['SGD', 'IDR'].includes(currency.code);
            
            return (
              <tr key={currency.code} className={`hover:bg-gray-50 ${isProtected ? 'bg-gray-50' : ''}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{currency.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{currency.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{currency.symbol}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {currency.is_active ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEditCurrency && onEditCurrency(currency)}
                    className={`text-primary-600 hover:text-primary-900 mr-4 focus:outline-none focus:underline ${
                      isProtected ? 'cursor-default' : ''
                    }`}
                    title={isProtected ? "System currencies can be edited but code changes may be restricted" : "Edit currency"}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(currency)}
                    className={`text-red-600 hover:text-red-900 focus:outline-none focus:underline ${
                      isProtected ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isProtected}
                    title={isProtected ? "System currencies cannot be deleted" : "Delete currency"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}