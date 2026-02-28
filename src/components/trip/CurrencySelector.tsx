import { ChevronDown, Check } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCurrency } from '@/hooks/useCurrency';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CurrencySelectorProps {
  compact?: boolean;
  variant?: 'default' | 'hero';
}

const currencyFlags: Record<string, string> = {
  AED: '🇦🇪', AUD: '🇦🇺', BHD: '🇧🇭', BRL: '🇧🇷', CAD: '🇨🇦',
  CNY: '🇨🇳', EGP: '🇪🇬', EUR: '🇪🇺', GBP: '🇬🇧', INR: '🇮🇳',
  JPY: '🇯🇵', KRW: '🇰🇷', KWD: '🇰🇼', MYR: '🇲🇾', OMR: '🇴🇲',
  PHP: '🇵🇭', PKR: '🇵🇰', RUB: '🇷🇺', SAR: '🇸🇦', THB: '🇹🇭',
  TRY: '🇹🇷', USD: '🇺🇸', QAR: '🇶🇦', SGD: '🇸🇬', ZAR: '🇿🇦',
};

const CurrencySelector = ({ compact = false, variant = 'default' }: CurrencySelectorProps) => {
  const { currencies, selectedCurrency, setCurrency, isLoading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return <div className="h-8 w-20 bg-muted animate-pulse rounded-full" />;
  }

  const currentCurrency = currencies.find(c => c.currency_code === selectedCurrency);
  const isHero = variant === 'hero';
  const flag = currencyFlags[selectedCurrency] || '🌐';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 rounded-full border transition-all duration-200 text-xs font-medium cursor-pointer",
            isHero
              ? "bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 px-2.5 py-1"
              : "bg-card border-border hover:border-primary/30 px-2.5 py-1"
          )}
        >
          <span className="text-sm leading-none">{flag}</span>
          <span className={cn(
            "font-semibold text-[11px] uppercase",
            isHero ? "text-white" : "text-foreground"
          )}>
            {currentCurrency?.currency_symbol} {selectedCurrency}
          </span>
          <ChevronDown className={cn(
            "w-3 h-3 transition-transform duration-200",
            isOpen && "rotate-180",
            isHero ? "text-white/50" : "text-muted-foreground"
          )} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-52 p-1 bg-popover border-border shadow-lg z-50 max-h-80 overflow-y-auto"
        align="center"
        sideOffset={6}
      >
        {currencies.map((currency) => {
          const isSelected = selectedCurrency === currency.currency_code;
          const cFlag = currencyFlags[currency.currency_code] || '🌐';
          return (
            <button
              key={currency.currency_code}
              onClick={() => {
                setCurrency(currency.currency_code);
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-md text-left transition-colors text-sm",
                isSelected
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted text-foreground"
              )}
            >
              <span className="text-base leading-none shrink-0">{cFlag}</span>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-xs">{currency.currency_code}</span>
                <p className="text-[10px] text-muted-foreground truncate leading-tight">{currency.currency_name}</p>
              </div>
              {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
};

export default CurrencySelector;
