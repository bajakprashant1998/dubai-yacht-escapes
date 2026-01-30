import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SortOption {
  value: string;
  label: string;
  icon?: LucideIcon;
}

interface SortingTabsProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SortingTabs = ({ options, value, onChange, className }: SortingTabsProps) => {
  return (
    <div className={cn("flex items-center gap-1 p-1 bg-muted/50 rounded-lg overflow-x-auto", className)}>
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition-all whitespace-nowrap",
              value === option.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export { SortingTabs };
export type { SortOption };
