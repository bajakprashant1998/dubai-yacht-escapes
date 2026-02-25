import { useState } from "react";
import { Filter, X, ChevronDown, Star, Clock, CheckCircle, Car, RotateCcw, Sparkles, DollarSign, Timer, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/hooks/useCurrency";

export interface FilterState {
  priceRange: [number, number];
  durations: string[];
  minRating: number | null;
  hotelPickup: boolean;
  instantConfirmation: boolean;
}

interface ServiceFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  maxPrice: number;
  activeFilterCount: number;
}

const durationOptions = [
  { value: "1-2", label: "1–2 hours", icon: "⚡" },
  { value: "2-4", label: "2–4 hours", icon: "☀️" },
  { value: "4-8", label: "Half day", icon: "🌤️" },
  { value: "8+", label: "Full day", icon: "🌅" },
];

const ratingOptions = [
  { value: 4, label: "4.0+", stars: 4 },
  { value: 4.5, label: "4.5+", stars: 5 },
];

export const defaultFilters: FilterState = {
  priceRange: [0, 2000],
  durations: [],
  minRating: null,
  hotelPickup: false,
  instantConfirmation: false,
};

const FilterContent = ({
  filters,
  onFiltersChange,
  maxPrice,
  onReset,
}: {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  maxPrice: number;
  onReset: () => void;
}) => {
  const { formatPrice } = useCurrency();
  const [priceOpen, setPriceOpen] = useState(true);
  const [durationOpen, setDurationOpen] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(true);
  const [featuresOpen, setFeaturesOpen] = useState(true);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleDuration = (duration: string) => {
    const newDurations = filters.durations.includes(duration)
      ? filters.durations.filter((d) => d !== duration)
      : [...filters.durations, duration];
    updateFilter("durations", newDurations);
  };

  const hasActiveFilters = filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice || 
    filters.durations.length > 0 || filters.minRating !== null || 
    filters.hotelPickup || filters.instantConfirmation;

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Filter className="w-4 h-4 text-secondary" />
          </div>
          <h3 className="font-bold text-foreground text-base">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="h-7 text-xs text-secondary hover:text-secondary hover:bg-secondary/10 gap-1 px-2">
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Price Range */}
      <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-t border-border/60 group">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
            <span className="font-semibold text-sm text-foreground">Price Range</span>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", priceOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-4">
          <div className="space-y-4 px-1">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
              max={maxPrice}
              min={0}
              step={50}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <div className="px-3 py-1.5 rounded-lg bg-muted/60 border border-border/50">
                <span className="text-xs font-medium text-foreground">{formatPrice(filters.priceRange[0])}</span>
              </div>
              <div className="h-px flex-1 mx-3 bg-border/50" />
              <div className="px-3 py-1.5 rounded-lg bg-muted/60 border border-border/50">
                <span className="text-xs font-medium text-foreground">{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Duration */}
      <Collapsible open={durationOpen} onOpenChange={setDurationOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-t border-border/60 group">
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
            <span className="font-semibold text-sm text-foreground">Duration</span>
            {filters.durations.length > 0 && (
              <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-secondary text-secondary-foreground text-[10px] font-bold">
                {filters.durations.length}
              </Badge>
            )}
          </div>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", durationOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-3">
          <div className="grid grid-cols-2 gap-2">
            {durationOptions.map((option) => {
              const isActive = filters.durations.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => toggleDuration(option.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 p-2.5 rounded-xl border text-center transition-all duration-200",
                    isActive
                      ? "border-secondary bg-secondary/10 text-secondary shadow-sm"
                      : "border-border/60 bg-card text-muted-foreground hover:border-secondary/40 hover:bg-secondary/5"
                  )}
                >
                  <span className="text-base">{option.icon}</span>
                  <span className="text-xs font-medium leading-tight">{option.label}</span>
                </button>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Rating */}
      <Collapsible open={ratingOpen} onOpenChange={setRatingOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-t border-border/60 group">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
            <span className="font-semibold text-sm text-foreground">Rating</span>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", ratingOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-3">
          <div className="flex gap-2">
            {ratingOptions.map((option) => {
              const isActive = filters.minRating === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => updateFilter("minRating", isActive ? null : option.value)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all duration-200 flex-1",
                    isActive
                      ? "border-secondary bg-secondary/10 text-secondary shadow-sm"
                      : "border-border/60 bg-card text-muted-foreground hover:border-secondary/40"
                  )}
                >
                  <Star className={cn("w-3.5 h-3.5", isActive ? "fill-secondary text-secondary" : "fill-muted-foreground/30 text-muted-foreground/30")} />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Features */}
      <Collapsible open={featuresOpen} onOpenChange={setFeaturesOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-t border-border/60 group">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
            <span className="font-semibold text-sm text-foreground">Features</span>
          </div>
          <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform duration-200", featuresOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 pb-3 space-y-2">
          <label
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all duration-200",
              filters.hotelPickup
                ? "border-secondary bg-secondary/10"
                : "border-border/60 bg-card hover:border-secondary/40"
            )}
          >
            <Checkbox
              id="hotel-pickup"
              checked={filters.hotelPickup}
              onCheckedChange={(checked) => updateFilter("hotelPickup", checked === true)}
              className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
            />
            <div className="flex items-center gap-2 flex-1">
              <Car className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Hotel Pickup</span>
            </div>
          </label>
          <label
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all duration-200",
              filters.instantConfirmation
                ? "border-secondary bg-secondary/10"
                : "border-border/60 bg-card hover:border-secondary/40"
            )}
          >
            <Checkbox
              id="instant-confirmation"
              checked={filters.instantConfirmation}
              onCheckedChange={(checked) => updateFilter("instantConfirmation", checked === true)}
              className="data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
            />
            <div className="flex items-center gap-2 flex-1">
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Instant Confirmation</span>
            </div>
          </label>
        </CollapsibleContent>
      </Collapsible>

      {/* Promo CTA */}
      <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border border-secondary/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span className="text-sm font-bold text-foreground">Best Price Guarantee</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Found a lower price? We'll match it and give you an extra 10% off.
        </p>
      </div>
    </div>
  );
};

// Desktop Sidebar
export const ServiceFiltersSidebar = ({
  filters,
  onFiltersChange,
  maxPrice,
  activeFilterCount,
}: ServiceFiltersProps) => {
  const handleReset = () => onFiltersChange(defaultFilters);

  return (
    <div className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-28 bg-card rounded-2xl border border-border/50 p-5 shadow-sm">
        <FilterContent
          filters={filters}
          onFiltersChange={onFiltersChange}
          maxPrice={maxPrice}
          onReset={handleReset}
        />
      </div>
    </div>
  );
};

// Mobile Drawer
export const ServiceFiltersDrawer = ({
  filters,
  onFiltersChange,
  maxPrice,
  activeFilterCount,
}: ServiceFiltersProps) => {
  const [open, setOpen] = useState(false);
  const handleReset = () => onFiltersChange(defaultFilters);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden relative rounded-xl gap-2 border-border/60">
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="h-5 w-5 p-0 flex items-center justify-center bg-secondary text-secondary-foreground text-[10px] font-bold">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 bg-card">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-secondary" />
            Filters
          </SheetTitle>
        </SheetHeader>
        <div className="py-4 overflow-y-auto max-h-[calc(100vh-160px)]">
          <FilterContent
            filters={filters}
            onFiltersChange={onFiltersChange}
            maxPrice={maxPrice}
            onReset={handleReset}
          />
        </div>
        <SheetFooter className="pt-4 border-t border-border/50">
          <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-semibold" onClick={() => setOpen(false)}>
            Show Results
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

// Active Filter Pills
export const ActiveFilterPills = ({
  filters,
  onFiltersChange,
  maxPrice,
}: {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  maxPrice: number;
}) => {
  const { formatPrice } = useCurrency();
  const pills: { label: string; onRemove: () => void }[] = [];

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) {
    pills.push({
      label: `${formatPrice(filters.priceRange[0])} – ${formatPrice(filters.priceRange[1])}`,
      onRemove: () => onFiltersChange({ ...filters, priceRange: [0, maxPrice] }),
    });
  }

  filters.durations.forEach((d) => {
    const option = durationOptions.find((o) => o.value === d);
    if (option) {
      pills.push({
        label: option.label,
        onRemove: () =>
          onFiltersChange({
            ...filters,
            durations: filters.durations.filter((dur) => dur !== d),
          }),
      });
    }
  });

  if (filters.minRating) {
    pills.push({
      label: `${filters.minRating}+ Stars`,
      onRemove: () => onFiltersChange({ ...filters, minRating: null }),
    });
  }

  if (filters.hotelPickup) {
    pills.push({
      label: "Hotel Pickup",
      onRemove: () => onFiltersChange({ ...filters, hotelPickup: false }),
    });
  }

  if (filters.instantConfirmation) {
    pills.push({
      label: "Instant Confirmation",
      onRemove: () => onFiltersChange({ ...filters, instantConfirmation: false }),
    });
  }

  if (pills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {pills.map((pill, index) => (
        <Badge
          key={index}
          variant="outline"
          className="pl-2.5 pr-1.5 py-1.5 flex items-center gap-1.5 cursor-pointer hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-colors rounded-lg group"
          onClick={pill.onRemove}
        >
          {pill.label}
          <X className="w-3 h-3 opacity-50 group-hover:opacity-100" />
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
        onClick={() => onFiltersChange(defaultFilters)}
      >
        Clear all
      </Button>
    </div>
  );
};

export default ServiceFiltersSidebar;
