import { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useVisaRules } from '@/hooks/useVisaRules';

interface NationalitySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const NationalitySelector = ({ value, onChange }: NationalitySelectorProps) => {
  const [open, setOpen] = useState(false);
  const { countries, isLoading, isVisaRequired, documentsRequired, visaOnArrival } = useVisaRules(value);

  const selectedCountry = useMemo(() => {
    return countries.find(c => c.code === value);
  }, [countries, value]);

  return (
    <div className="space-y-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-12 text-base"
          >
            {selectedCountry ? (
              <span className="flex items-center gap-2">
                <span className="text-xl">
                  {getFlagEmoji(selectedCountry.code)}
                </span>
                {selectedCountry.name}
              </span>
            ) : (
              <span className="text-muted-foreground">Select your nationality...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>
                {isLoading ? 'Loading...' : 'No country found.'}
              </CommandEmpty>
              <CommandGroup>
                {countries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={`${country.name} ${country.code}`}
                    onSelect={() => {
                      onChange(country.code);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === country.code ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <span className="mr-2 text-lg">{getFlagEmoji(country.code)}</span>
                    {country.name}
                    {!country.visaRequired && (
                      <span className="ml-auto text-xs text-emerald-600 font-medium">
                        No Visa
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Visa Status Banner */}
      {value && (
        <div
          className={cn(
            'p-4 rounded-xl border flex items-start gap-3',
            isVisaRequired
              ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800'
              : 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800'
          )}
        >
          {isVisaRequired ? (
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          )}
          <div>
            <h4 className={cn(
              'font-medium',
              isVisaRequired ? 'text-amber-800 dark:text-amber-200' : 'text-emerald-800 dark:text-emerald-200'
            )}>
              {isVisaRequired 
                ? (visaOnArrival ? 'Visa on Arrival Available' : 'UAE Visa Required')
                : 'No Visa Required'
              }
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              {isVisaRequired
                ? `We'll add a ${visaOnArrival ? 'visa on arrival' : 'tourist visa'} to your trip plan. Documents needed: passport, photo, & booking confirmation.`
                : 'Great news! You can enter the UAE visa-free for up to 30 days.'
              }
            </p>
            {isVisaRequired && documentsRequired.length > 0 && (
              <ul className="mt-2 text-sm space-y-1">
                {documentsRequired.slice(0, 3).map((doc, i) => (
                  <li key={i} className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                    {doc}
                  </li>
                ))}
                {documentsRequired.length > 3 && (
                  <li className="text-amber-600 text-xs">
                    +{documentsRequired.length - 3} more documents
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper to get flag emoji from country code
function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default NationalitySelector;
