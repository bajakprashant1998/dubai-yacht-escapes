import { Minus, Plus, Users, Baby } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TravelerCounterProps {
  adults: number;
  children: number;
  onAdultsChange: (value: number) => void;
  onChildrenChange: (value: number) => void;
  maxAdults?: number;
  maxChildren?: number;
}

const TravelerCounter = ({
  adults,
  children,
  onAdultsChange,
  onChildrenChange,
  maxAdults = 10,
  maxChildren = 6,
}: TravelerCounterProps) => {
  return (
    <div className="space-y-4">
      {/* Adults */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-border transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">Adults</p>
            <p className="text-sm text-muted-foreground">Age 12+</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => onAdultsChange(Math.max(1, adults - 1))}
            disabled={adults <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-semibold text-lg">{adults}</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => onAdultsChange(Math.min(maxAdults, adults + 1))}
            disabled={adults >= maxAdults}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Children */}
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-border transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
            <Baby className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="font-medium">Children</p>
            <p className="text-sm text-muted-foreground">Age 2-11</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => onChildrenChange(Math.max(0, children - 1))}
            disabled={children <= 0}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-semibold text-lg">{children}</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => onChildrenChange(Math.min(maxChildren, children + 1))}
            disabled={children >= maxChildren}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary */}
      <p className="text-center text-sm text-muted-foreground">
        Total: <span className="font-medium text-foreground">{adults + children} travelers</span>
      </p>
    </div>
  );
};

export default TravelerCounter;
