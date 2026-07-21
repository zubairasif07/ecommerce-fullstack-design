import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface LocaleContextType {
  language: string;
  currency: string;
  setLanguage: (lang: string) => void;
  setCurrency: (curr: string) => void;
  convertCurrency: (amount: number, toCurrency: string) => number;
  getDisplayPrice: (amount: number) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const EXCHANGE_RATES: Record<string, number> = {
  'USD - Dollar': 1,
  'EUR - Euro': 0.92,
  'GBP - Pound': 0.79,
  'JPY - Yen': 149.5,
  'INR - Rupee': 83.12,
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  'USD - Dollar': '$',
  'EUR - Euro': '€',
  'GBP - Pound': '£',
  'JPY - Yen': '¥',
  'INR - Rupee': '₹',
};

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState(() => localStorage.getItem('shopsphere_language') || 'English');
  const [currency, setCurrencyState] = useState(() => localStorage.getItem('shopsphere_currency') || 'USD - Dollar');

  // Save to localStorage when they change
  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('shopsphere_language', lang);
  };

  const setCurrency = (curr: string) => {
    setCurrencyState(curr);
    localStorage.setItem('shopsphere_currency', curr);
  };

  // Convert amount from USD to selected currency
  const convertCurrency = (amount: number, toCurrency: string): number => {
    const rate = EXCHANGE_RATES[toCurrency] || 1;
    return parseFloat((amount * rate).toFixed(2));
  };

  // Get formatted price with currency symbol
  const getDisplayPrice = (amount: number): string => {
    const converted = convertCurrency(amount, currency);
    const symbol = CURRENCY_SYMBOLS[currency] || '$';
    return `${symbol}${converted.toFixed(2)}`;
  };

  return (
    <LocaleContext.Provider
      value={{
        language,
        currency,
        setLanguage,
        setCurrency,
        convertCurrency,
        getDisplayPrice,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return context;
};
