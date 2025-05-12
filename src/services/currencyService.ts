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
    const response = await apiClient.get('/currencies/user/currencies');
    return response.data;
  } catch (error) {
    console.error('Error fetching user currencies:', error);
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

// Function to get user currencies for a specific user - temporary implementation
// until proper backend endpoint is available
export const getUserCurrenciesForAdmin = async (userId: number): Promise<UserCurrency[]> => {
  try {
    // For now, we'll just use placeholder data since the endpoint doesn't exist
    // In a real implementation, you would need to create this endpoint in your backend
    console.log(`Fetching currencies for user ${userId} (simulated)`);
    
    // Get all available currencies as a fallback
    const allCurrencies = await getAllCurrencies();
    
    // Create a dummy UserCurrency object for each currency
    // Only the first one will be marked as default
    const userCurrencies = allCurrencies
      .filter(currency => currency.is_active !== false)
      .map((currency, index) => ({
        id: index + 1,
        user_id: userId,
        currency_code: currency.code,
        is_default: index === 0, // First one is default
        currency: currency
      }));
    
    return userCurrencies;
  } catch (error) {
    console.error(`Error fetching currencies for user ${userId}:`, error);
    throw error;
  }
};

// Simulated function to assign currency to user
export const assignCurrencyToUser = async (userId: number, currencyCode: string, isDefault = false): Promise<UserCurrency> => {
  console.log(`Simulating assigning currency ${currencyCode} to user ${userId}`);
  // In a real implementation, you would create this endpoint in your backend
  return {
    id: Math.floor(Math.random() * 1000),
    user_id: userId,
    currency_code: currencyCode,
    is_default: isDefault,
    currency: {
      code: currencyCode,
      name: currencyCode === 'SGD' ? 'Singapore Dollar' : 'Indonesian Rupiah',
      symbol: currencyCode === 'SGD' ? 'S$' : 'Rp',
      is_active: true
    }
  };
};

// Simulated function to remove currency from user
export const removeCurrencyFromUser = async (userId: number, currencyCode: string): Promise<void> => {
  console.log(`Simulating removing currency ${currencyCode} from user ${userId}`);
  // In a real implementation, you would create this endpoint in your backend
};

// Simulated function to set default currency for user
export const setUserDefaultCurrency = async (userId: number, currencyCode: string): Promise<void> => {
  console.log(`Simulating setting default currency ${currencyCode} for user ${userId}`);
  // In a real implementation, you would create this endpoint in your backend
};

/**
 * Update a user's currency assignments
 */
export const updateUserCurrencies = async (userId: number, currencies: string[], defaultCurrency: string): Promise<void> => {
  try {
    const response = await apiClient.post(`/users/${userId}/currencies`, {
      currencies,
      default_currency: defaultCurrency
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating currencies for user ${userId}:`, error);
    throw error;
  }
};