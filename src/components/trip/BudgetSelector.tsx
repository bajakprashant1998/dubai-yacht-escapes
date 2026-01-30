import { Wallet, Crown, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

type BudgetTier = 'low' | 'medium' | 'luxury';

interface BudgetSelectorProps {
  value: BudgetTier;
  onChange: (value: BudgetTier) => void;
}

const budgets: Array<{
  id: BudgetTier;
  label: string;
  description: string;
  icon: React.ElementType;
  priceRange: string;
  features: string[];
}> = [
  {
    id: 'low',
    label: 'Budget-Friendly',
    description: 'Great value experiences',
    icon: Wallet,
    priceRange: '~500-800 AED/day',
    features: ['3-star hotels', 'Shared transfers', 'Popular attractions'],
  },
  {
    id: 'medium',
    label: 'Comfort',
    description: 'Best balance of value & quality',
    icon: Crown,
    priceRange: '~1000-1500 AED/day',
    features: ['4-star hotels', 'Private sedan', 'Premium experiences'],
  },
  {
    id: 'luxury',
    label: 'Luxury',
    description: 'Ultimate Dubai experience',
    icon: Gem,
    priceRange: '~2500+ AED/day',
    features: ['5-star resorts', 'Luxury vehicles', 'VIP access'],
  },
];

const BudgetSelector = ({ value, onChange }: BudgetSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {budgets.map((budget) => {
        const isSelected = value === budget.id;
        const Icon = budget.icon;

        return (
          <button
            key={budget.id}
            type="button"
            onClick={() => onChange(budget.id)}
            className={cn(
              'relative p-5 rounded-2xl border-2 text-left transition-all duration-300',
              'hover:shadow-lg hover:scale-[1.02]',
              isSelected
                ? 'border-secondary bg-secondary/5 shadow-md'
                : 'border-border bg-card hover:border-secondary/50'
            )}
          >
            {/* Popular badge for medium */}
            {budget.id === 'medium' && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-secondary text-secondary-foreground text-xs font-semibold rounded-full">
                Most Popular
              </span>
            )}

            <div className="flex items-start gap-4">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                  isSelected ? 'bg-secondary text-secondary-foreground' : 'bg-muted'
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg">{budget.label}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {budget.description}
                </p>
                <p className="text-xs font-medium text-secondary mb-3">
                  {budget.priceRange}
                </p>
                <ul className="space-y-1">
                  {budget.features.map((feature, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-secondary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-4 h-4 text-secondary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default BudgetSelector;
