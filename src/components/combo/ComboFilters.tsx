import { Users, Heart, Mountain, Crown, Sparkles, Grid3X3, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useComboPackageTypes } from "@/hooks/useComboPackageTypes";

interface ComboFiltersProps {
  activeType: string;
  onTypeChange: (type: string) => void;
}

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
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        key="all"
        variant={activeType === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => onTypeChange("all")}
        className={cn(
          "gap-1.5 rounded-full transition-all text-xs h-9 px-4",
          activeType === "all"
            ? "bg-secondary text-secondary-foreground shadow-md"
            : "hover:bg-secondary/10 hover:text-secondary hover:border-secondary/50"
        )}
      >
        <Grid3X3 className="w-3.5 h-3.5" />
        All
      </Button>

      {packageTypes.map((type) => {
        const Icon = iconMap[type.icon] || Sparkles;
        const isActive = activeType === type.slug;
        
        return (
          <Button
            key={type.id}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeChange(type.slug)}
            className={cn(
              "gap-1.5 rounded-full transition-all text-xs h-9 px-4",
              isActive
                ? "bg-secondary text-secondary-foreground shadow-md"
                : "hover:bg-secondary/10 hover:text-secondary hover:border-secondary/50"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {type.name}
          </Button>
        );
      })}
    </div>
  );
};

export default ComboFilters;
