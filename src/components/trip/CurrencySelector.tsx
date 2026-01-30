import { ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrency } from '@/hooks/useCurrency';

interface CurrencySelectorProps {
  compact?: boolean;
}

const CurrencySelector = ({ compact = false }: CurrencySelectorProps) => {
  const { currencies, selectedCurrency, setCurrency, isLoading } = useCurrency();

  if (isLoading) {
    return (
      <div className="h-10 w-20 bg-muted animate-pulse rounded-md" />
    );
  }

  const currentCurrency = currencies.find(c => c.currency_code === selectedCurrency);

  return (
    <Select value={selectedCurrency} onValueChange={setCurrency}>
      <SelectTrigger className={compact ? 'w-[90px] h-9' : 'w-[140px]'}>
        <SelectValue>
          {compact ? (
            <span className="font-medium">{selectedCurrency}</span>
          ) : (
            <span className="flex items-center gap-2">
              <span>{currentCurrency?.currency_symbol}</span>
              <span>{selectedCurrency}</span>
            </span>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.currency_code} value={currency.currency_code}>
            <span className="flex items-center gap-2">
              <span className="w-6 text-center">{currency.currency_symbol}</span>
              <span>{currency.currency_code}</span>
              {!compact && (
                <span className="text-muted-foreground text-sm ml-1">
                  - {currency.currency_name}
                </span>
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
