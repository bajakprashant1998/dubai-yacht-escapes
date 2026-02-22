import { useCurrency } from "@/hooks/useCurrency";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CurrencySelector = () => {
  const { currencies, selectedCurrency, setCurrency, isLoading } = useCurrency();

  if (isLoading || currencies.length <= 1) return null;

  return (
    <Select value={selectedCurrency} onValueChange={setCurrency}>
      <SelectTrigger className="w-[120px] h-9 text-sm rounded-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((c) => (
          <SelectItem key={c.currency_code} value={c.currency_code}>
            {c.currency_symbol} {c.currency_code}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencySelector;
