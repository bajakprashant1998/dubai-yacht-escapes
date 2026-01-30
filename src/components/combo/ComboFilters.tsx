import { Users, Heart, Mountain, Crown, Sparkles, Grid3X3, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useComboPackageTypes } from "@/hooks/useComboPackageTypes";

interface ComboFiltersProps {
  activeType: string;
  onTypeChange: (type: string) => void;
}

// Icon mapping for dynamic icons from database
const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  users: Users,
  heart: Heart,
  mountain: Mountain,
  crown: Crown,
  grid3x3: Grid3X3,
};

const ComboFilters = ({ activeType, onTypeChange }: ComboFiltersProps) => {
  const { data: packageTypes = [], isLoading } = useComboPackageTypes();

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {/* All Combos option */}
      <Button
        key="all"
        variant={activeType === "all" ? "default" : "outline"}
        size="lg"
        onClick={() => onTypeChange("all")}
        className={cn(
          "gap-2 transition-all",
          activeType === "all"
            ? "bg-secondary text-secondary-foreground shadow-md"
            : "hover:bg-secondary/10 hover:text-secondary hover:border-secondary"
        )}
      >
        <Grid3X3 className="w-4 h-4" />
        All Combos
      </Button>

      {/* Dynamic package types from database */}
      {packageTypes.map((type) => {
        const Icon = iconMap[type.icon] || Sparkles;
        const isActive = activeType === type.slug;
        
        return (
          <Button
            key={type.id}
            variant={isActive ? "default" : "outline"}
            size="lg"
            onClick={() => onTypeChange(type.slug)}
            className={cn(
              "gap-2 transition-all",
              isActive
                ? "bg-secondary text-secondary-foreground shadow-md"
                : "hover:bg-secondary/10 hover:text-secondary hover:border-secondary"
            )}
          >
            <Icon className="w-4 h-4" />
            {type.name}
          </Button>
        );
      })}
    </div>
  );
};

export default ComboFilters;
