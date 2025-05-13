// src/hooks/useCurrencies.ts
import { useState, useEffect } from 'react';
import { getAllCurrencies } from '@/services/currencyService';
import { Currency } from '@/services/currencyService';

interface UseCurrenciesReturn {
  currencies: Currency[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useCurrencies = (): UseCurrenciesReturn => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCurrencies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAllCurrencies();
      setCurrencies(data);
    } catch (err) {
      console.error('Error in useCurrencies hook:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return {
    currencies,
    loading,
    error,
    refetch: fetchCurrencies
  };
};