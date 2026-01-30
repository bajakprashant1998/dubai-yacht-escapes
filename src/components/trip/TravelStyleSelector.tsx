import { Users, Heart, Sparkles, Coffee, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

type TravelStyle = 'family' | 'couple' | 'adventure' | 'relax' | 'luxury';

interface TravelStyleSelectorProps {
  value: TravelStyle;
  onChange: (value: TravelStyle) => void;
}

const styles: Array<{
  id: TravelStyle;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}> = [
  {
    id: 'family',
    label: 'Family',
    description: 'Kid-friendly activities & theme parks',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    id: 'couple',
    label: 'Romantic',
    description: 'Sunset cruises & fine dining',
    icon: Heart,
    color: 'bg-rose-500',
  },
  {
    id: 'adventure',
    label: 'Adventure',
    description: 'Desert safari & thrilling experiences',
    icon: Sparkles,
    color: 'bg-orange-500',
  },
  {
    id: 'relax',
    label: 'Relaxation',
    description: 'Beach resorts & spa retreats',
    icon: Coffee,
    color: 'bg-teal-500',
  },
  {
    id: 'luxury',
    label: 'Luxury',
    description: 'VIP access & premium experiences',
    icon: Crown,
    color: 'bg-amber-500',
  },
];

const TravelStyleSelector = ({ value, onChange }: TravelStyleSelectorProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {styles.map((style) => {
        const isSelected = value === style.id;
        const Icon = style.icon;

        return (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            className={cn(
              'relative p-4 rounded-xl border-2 text-center transition-all duration-300',
              'hover:shadow-md hover:scale-[1.02] flex flex-col items-center gap-3',
              isSelected
                ? 'border-secondary bg-secondary/5 shadow-sm'
                : 'border-border bg-card hover:border-secondary/50'
            )}
          >
            <div
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center transition-colors',
                isSelected ? style.color : 'bg-muted'
              )}
            >
              <Icon className={cn('w-7 h-7', isSelected ? 'text-white' : 'text-muted-foreground')} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{style.label}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {style.description}
              </p>
            </div>

            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-3 h-3 text-secondary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export default TravelStyleSelector;
