import { Gift, Heart, PartyPopper, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

type SpecialOccasion = 'none' | 'birthday' | 'honeymoon' | 'anniversary';

interface SpecialOccasionSelectorProps {
  value: SpecialOccasion;
  onChange: (value: SpecialOccasion) => void;
}

const occasions: Array<{
  id: SpecialOccasion;
  label: string;
  icon: React.ElementType;
  description: string;
}> = [
  {
    id: 'none',
    label: 'Just Traveling',
    icon: Minus,
    description: 'Regular vacation',
  },
  {
    id: 'birthday',
    label: 'Birthday',
    icon: PartyPopper,
    description: 'Special celebration',
  },
  {
    id: 'honeymoon',
    label: 'Honeymoon',
    icon: Heart,
    description: 'Romantic getaway',
  },
  {
    id: 'anniversary',
    label: 'Anniversary',
    icon: Gift,
    description: 'Celebration of love',
  },
];

const SpecialOccasionSelector = ({ value, onChange }: SpecialOccasionSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {occasions.map((occasion) => {
        const isSelected = value === occasion.id;
        const Icon = occasion.icon;

        return (
          <button
            key={occasion.id}
            type="button"
            onClick={() => onChange(occasion.id)}
            className={cn(
              'relative p-4 rounded-xl border-2 transition-all duration-300',
              'hover:shadow-md flex flex-col items-center gap-2 text-center',
              isSelected
                ? 'border-secondary bg-secondary/5 shadow-sm'
                : 'border-border bg-card hover:border-secondary/50'
            )}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center',
                isSelected ? 'bg-secondary text-secondary-foreground' : 'bg-muted'
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-sm">{occasion.label}</h3>
              <p className="text-xs text-muted-foreground">{occasion.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SpecialOccasionSelector;
