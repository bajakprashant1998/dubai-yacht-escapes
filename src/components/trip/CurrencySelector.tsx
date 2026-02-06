import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
    return (
      <div className="h-12 w-32 bg-muted animate-pulse rounded-xl" />
    );
  }

  const currentCurrency = currencies.find(c => c.currency_code === selectedCurrency);

  const isHero = variant === 'hero';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300",
            isHero 
              ? "bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:border-white/30" 
              : "bg-card border-border hover:border-primary/30 hover:shadow-md"
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            isHero ? "bg-white/20" : "bg-primary/10"
          )}>
            <Globe className={cn("w-4 h-4", isHero ? "text-white" : "text-primary")} />
          </div>
          <div className="flex flex-col items-start">
            <span className={cn(
              "text-[10px] uppercase tracking-wider",
              isHero ? "text-white/60" : "text-muted-foreground"
            )}>
              Currency
            </span>
            <span className={cn(
              "font-semibold text-sm flex items-center gap-1",
              isHero ? "text-white" : "text-foreground"
            )}>
              {currentCurrency?.currency_symbol} {selectedCurrency}
            </span>
          </div>
          <ChevronDown className={cn(
            "w-4 h-4 ml-1 transition-transform duration-200",
            isOpen && "rotate-180",
            isHero ? "text-white/60" : "text-muted-foreground"
          )} />
        </motion.button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-2 bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl" 
        align="center"
        sideOffset={8}
      >
        <div className="grid gap-1">
          {currencies.map((currency, index) => (
            <motion.button
              key={currency.currency_code}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => {
                setCurrency(currency.currency_code);
                setIsOpen(false);
              }}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left transition-all duration-200",
                selectedCurrency === currency.currency_code
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-muted text-foreground"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center text-lg font-medium",
                selectedCurrency === currency.currency_code
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}>
                {currency.currency_symbol}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{currency.currency_code}</p>
                <p className="text-xs text-muted-foreground">{currency.currency_name}</p>
              </div>
              {selectedCurrency === currency.currency_code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CurrencySelector;
