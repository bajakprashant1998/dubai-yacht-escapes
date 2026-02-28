import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion } from 'framer-motion';
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

const CurrencySelector = ({ compact = false, variant = 'default' }: CurrencySelectorProps) => {
  const { currencies, selectedCurrency, setCurrency, isLoading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />;
  }

  const currentCurrency = currencies.find(c => c.currency_code === selectedCurrency);
  const isHero = variant === 'hero';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 rounded-full border transition-all duration-200 text-xs font-medium",
            isHero
              ? "bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 px-3 py-1.5"
              : "bg-card border-border hover:border-primary/30 hover:shadow-sm px-2.5 py-1.5"
          )}
        >
          <Globe className={cn("w-3.5 h-3.5", isHero ? "text-white/70" : "text-muted-foreground")} />
          <span className={cn(
            "uppercase tracking-wide text-[10px]",
            isHero ? "text-white/60" : "text-muted-foreground"
          )}>
            Currency
          </span>
          <span className={cn(
            "font-semibold text-xs",
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
        className="w-56 p-1.5 bg-card border-border shadow-xl z-50"
        align="center"
        sideOffset={6}
      >
        <div className="grid gap-0.5">
          {currencies.map((currency, index) => (
            <motion.button
              key={currency.currency_code}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => {
                setCurrency(currency.currency_code);
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-left transition-all duration-150",
                selectedCurrency === currency.currency_code
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted text-foreground"
              )}
            >
              <div className={cn(
                "w-7 h-7 rounded-md flex items-center justify-center text-sm font-medium shrink-0",
                selectedCurrency === currency.currency_code
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}>
                {currency.currency_symbol}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs">{currency.currency_code}</p>
                <p className="text-[10px] text-muted-foreground truncate">{currency.currency_name}</p>
              </div>
              {selectedCurrency === currency.currency_code && (
                <Check className="w-3.5 h-3.5 text-primary shrink-0" />
              )}
            </motion.button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CurrencySelector;
