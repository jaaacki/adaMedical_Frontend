// src/services/currencyService.ts
import apiClient from '@/lib/api-client';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  is_active: boolean;
}

export interface UserCurrency {
  id: number;
  user_id: number;
  currency_code: string;
  is_default: boolean;
  currency: Currency;
}

/**
 * Get currencies assigned to the current user
 */
export const getUserCurrencies = async (): Promise<UserCurrency[]> => {
  try {
    const response = await apiClient.get('/currencies/user');
    return response.data;
  } catch (error) {
    console.error('Error fetching user currencies:', error);
    throw error;
  }
};

/**
 * Set user's default currency
 */
export const setDefaultCurrency = async (currencyCode: string): Promise<void> => {
  try {
    await apiClient.put('/currencies/user/default', { currency_code: currencyCode });
  } catch (error) {
    console.error('Error setting default currency:', error);
    throw error;
  }
};

/**
 * Get list of all available currencies in the system
 */
export const getAllCurrencies = async (): Promise<Currency[]> => {
  try {
    const response = await apiClient.get('/currencies');
    return response.data;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
};