import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode, createElement } from 'react';
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

const detectUserCurrency = (): string => {
  const locale = navigator.language || 'en-US';
  const currencyMap: Record<string, string> = {
    'en-US': 'USD', 'en-GB': 'GBP', 'en-AU': 'AUD', 'en-CA': 'CAD',
    'en-IN': 'INR', 'en-AE': 'AED', 'ar-AE': 'AED', 'ar-SA': 'SAR',
    'de-DE': 'EUR', 'fr-FR': 'EUR', 'es-ES': 'EUR', 'it-IT': 'EUR',
    'pt-BR': 'BRL', 'ja-JP': 'JPY', 'ko-KR': 'KRW', 'zh-CN': 'CNY',
    'ru-RU': 'RUB', 'tr-TR': 'TRY', 'hi-IN': 'INR', 'ur-PK': 'PKR',
    'th-TH': 'THB',
  };
  if (currencyMap[locale]) return currencyMap[locale];
  const lang = locale.split('-')[0];
  const langMatch = Object.entries(currencyMap).find(([key]) => key.startsWith(lang + '-'));
  if (langMatch) return langMatch[1];
  return 'USD';
};

interface CurrencyContextType {
  currencies: CurrencyRate[];
  selectedCurrency: string;
  currentRate: Pick<CurrencyRate, 'currency_code' | 'currency_symbol' | 'rate_to_aed' | 'margin_percent'>;
  isLoading: boolean;
  setCurrency: (code: string) => void;
  convertFromAED: (amountAED: number) => number;
  formatPrice: (amountAED: number, showSymbol?: boolean) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [selectedCurrency, setSelectedCurrency] = useState<string>(() => {
    const stored = localStorage.getItem(CURRENCY_STORAGE_KEY);
    return stored || detectUserCurrency();
  });

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
    staleTime: 1000 * 60 * 60,
  });

  const currentRate = useMemo(() => {
    return currencies.find(c => c.currency_code === selectedCurrency) ||
           currencies.find(c => c.currency_code === 'AED') ||
           { currency_code: 'AED', currency_symbol: 'د.إ', rate_to_aed: 1, margin_percent: 0 };
  }, [currencies, selectedCurrency]);

  const convertFromAED = useCallback((amountAED: number): number => {
    if (!currentRate || currentRate.currency_code === 'AED') return amountAED;
    const rate = currentRate.rate_to_aed;
    const margin = currentRate.margin_percent / 100;
    const adjustedRate = rate * (1 + margin);
    return Math.round(amountAED * adjustedRate * 100) / 100;
  }, [currentRate]);

  const formatPrice = useCallback((amountAED: number, showSymbol = true): string => {
    const converted = convertFromAED(amountAED);
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(converted);
    if (!showSymbol) return formatted;
    return `${currentRate?.currency_symbol || 'د.إ'} ${formatted}`;
  }, [convertFromAED, currentRate]);

  const setCurrency = useCallback((code: string) => {
    setSelectedCurrency(code);
    localStorage.setItem(CURRENCY_STORAGE_KEY, code);
  }, []);

  useEffect(() => {
    if (currencies.length > 0 && !currencies.some(c => c.currency_code === selectedCurrency)) {
      setCurrency('AED');
    }
  }, [currencies, selectedCurrency, setCurrency]);

  const value = useMemo(() => ({
    currencies,
    selectedCurrency,
    currentRate,
    isLoading,
    setCurrency,
    convertFromAED,
    formatPrice,
  }), [currencies, selectedCurrency, currentRate, isLoading, setCurrency, convertFromAED, formatPrice]);

  return createElement(CurrencyContext.Provider, { value }, children);
}

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
