import { Users, Heart, Mountain, Crown, Sparkles, Grid3X3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComboFiltersProps {
  activeType: string;
  onTypeChange: (type: string) => void;
}

const filterOptions = [
  { value: "all", label: "All Combos", icon: Grid3X3 },
  { value: "essentials", label: "Essentials", icon: Sparkles },
  { value: "family", label: "Family", icon: Users },
  { value: "couple", label: "Romantic", icon: Heart },
  { value: "adventure", label: "Adventure", icon: Mountain },
  { value: "luxury", label: "Luxury", icon: Crown },
];

const ComboFilters = ({ activeType, onTypeChange }: ComboFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {filterOptions.map((option) => {
        const Icon = option.icon;
        const isActive = activeType === option.value;
        
        return (
          <Button
            key={option.value}
            variant={isActive ? "default" : "outline"}
            size="lg"
            onClick={() => onTypeChange(option.value)}
            className={cn(
              "gap-2 transition-all",
              isActive
                ? "bg-secondary text-secondary-foreground shadow-md"
                : "hover:bg-secondary/10 hover:text-secondary hover:border-secondary"
            )}
          >
            <Icon className="w-4 h-4" />
            {option.label}
          </Button>
        );
      })}
    </div>
  );
};

export default ComboFilters;
