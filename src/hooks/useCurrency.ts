import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export interface CurrencyRate {
  id: string;
  currency_code: string;
  currency_name: string;
  currency_symbol: string;
  rate_to_aed: number;
  margin_percent: number;
  is_enabled: boolean;
}

const CURRENCY_STORAGE_KEY = 'preferred_currency';

// Detect user's likely currency from browser locale
const detectUserCurrency = (): string => {
  const locale = navigator.language || 'en-US';
  const currencyMap: Record<string, string> = {
    'en-US': 'USD',
    'en-GB': 'GBP',
    'en-AU': 'AUD',
    'en-CA': 'CAD',
    'en-IN': 'INR',
    'en-AE': 'AED',
    'ar-AE': 'AED',
    'ar-SA': 'SAR',
    'de-DE': 'EUR',
    'fr-FR': 'EUR',
    'es-ES': 'EUR',
    'it-IT': 'EUR',
    'pt-BR': 'BRL',
    'ja-JP': 'JPY',
    'ko-KR': 'KRW',
    'zh-CN': 'CNY',
    'ru-RU': 'RUB',
    'tr-TR': 'TRY',
    'hi-IN': 'INR',
    'ur-PK': 'PKR',
    'th-TH': 'THB',
  };

  // Check for exact match
  if (currencyMap[locale]) {
    return currencyMap[locale];
  }

  // Check for language-only match
  const lang = locale.split('-')[0];
  const langMatch = Object.entries(currencyMap).find(([key]) => key.startsWith(lang + '-'));
  if (langMatch) {
    return langMatch[1];
  }

  return 'USD'; // Default
};

export const useCurrency = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>(() => {
    // Check localStorage first, then detect from browser
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    return stored || detectUserCurrency();
  });

  // Fetch available currencies
  const { data: currencies = [], isLoading } = useQuery({
    queryKey: ['currency-rates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('currency_rates')
        .select('*')
        .eq('is_enabled', true)
        .order('currency_code');

      if (error) throw error;
      return data as CurrencyRate[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Get the current currency rate
  const currentRate = useMemo(() => {
    return currencies.find(c => c.currency_code === selectedCurrency) || 
           currencies.find(c => c.currency_code === 'AED') ||
           { currency_code: 'AED', currency_symbol: 'د.إ', rate_to_aed: 1, margin_percent: 0 };
  }, [currencies, selectedCurrency]);

  // Convert AED to selected currency
  const convertFromAED = useCallback((amountAED: number): number => {
    if (!currentRate || currentRate.currency_code === 'AED') return amountAED;
    
    const rate = currentRate.rate_to_aed;
    const margin = currentRate.margin_percent / 100;
    const adjustedRate = rate * (1 + margin);
    
    return Math.round(amountAED * adjustedRate * 100) / 100;
  }, [currentRate]);

  // Format price with currency symbol
  const formatPrice = useCallback((amountAED: number, showSymbol = true): string => {
    const converted = convertFromAED(amountAED);
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(converted);

    if (!showSymbol) return formatted;
    return `${currentRate?.currency_symbol || 'د.إ'} ${formatted}`;
  }, [convertFromAED, currentRate]);

  // Change currency and persist
  const setCurrency = useCallback((code: string) => {
    setSelectedCurrency(code);
    localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  }, []);

  // Ensure selected currency is valid
  useEffect(() => {
    if (currencies.length > 0 && !currencies.some(c => c.currency_code === selectedCurrency)) {
      setCurrency('AED');
    }
  }, [currencies, selectedCurrency, setCurrency]);

  return {
    currencies,
    selectedCurrency,
    currentRate,
    isLoading,
    setCurrency,
    convertFromAED,
    formatPrice,
  };
};
