import { useState } from "react";
import { Filter, X, ChevronDown, Star, Clock, CheckCircle, Car, RotateCcw } from "lucide-react";
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
  { value: "1-2", label: "1-2 hours" },
  { value: "2-4", label: "2-4 hours" },
  { value: "4-8", label: "Half day (4-8 hours)" },
  { value: "8+", label: "Full day (8+ hours)" },
];

const ratingOptions = [
  { value: 4, label: "4+ Stars" },
  { value: 4.5, label: "4.5+ Stars" },
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onReset} className="h-8 text-xs">
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {/* Price Range */}
      <Collapsible open={priceOpen} onOpenChange={setPriceOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t border-border">
          <span className="font-medium text-sm">Price Range</span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", priceOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 pb-2">
          <div className="space-y-4">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
              max={maxPrice}
              min={0}
              step={50}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>AED {filters.priceRange[0]}</span>
              <span>AED {filters.priceRange[1]}</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Duration */}
      <Collapsible open={durationOpen} onOpenChange={setDurationOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t border-border">
          <span className="font-medium text-sm">Duration</span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", durationOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 pb-2 space-y-2">
          {durationOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`duration-${option.value}`}
                checked={filters.durations.includes(option.value)}
                onCheckedChange={() => toggleDuration(option.value)}
              />
              <Label
                htmlFor={`duration-${option.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Rating */}
      <Collapsible open={ratingOpen} onOpenChange={setRatingOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t border-border">
          <span className="font-medium text-sm">Rating</span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", ratingOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 pb-2 space-y-2">
          {ratingOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`rating-${option.value}`}
                checked={filters.minRating === option.value}
                onCheckedChange={(checked) =>
                  updateFilter("minRating", checked ? option.value : null)
                }
              />
              <Label
                htmlFor={`rating-${option.value}`}
                className="text-sm font-normal cursor-pointer flex items-center gap-1"
              >
                <Star className="w-3 h-3 fill-secondary text-secondary" />
                {option.label}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Features */}
      <Collapsible open={featuresOpen} onOpenChange={setFeaturesOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 border-t border-border">
          <span className="font-medium text-sm">Features</span>
          <ChevronDown className={cn("w-4 h-4 transition-transform", featuresOpen && "rotate-180")} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3 pb-2 space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="hotel-pickup"
              checked={filters.hotelPickup}
              onCheckedChange={(checked) => updateFilter("hotelPickup", checked === true)}
            />
            <Label htmlFor="hotel-pickup" className="text-sm font-normal cursor-pointer flex items-center gap-1">
              <Car className="w-3 h-3" />
              Hotel Pickup
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="instant-confirmation"
              checked={filters.instantConfirmation}
              onCheckedChange={(checked) => updateFilter("instantConfirmation", checked === true)}
            />
            <Label htmlFor="instant-confirmation" className="text-sm font-normal cursor-pointer flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Instant Confirmation
            </Label>
          </div>
        </CollapsibleContent>
      </Collapsible>
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
    <div className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-28 bg-card rounded-xl border border-border p-4">
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
        <Button variant="outline" size="sm" className="lg:hidden relative">
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-secondary text-secondary-foreground">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <FilterContent
            filters={filters}
            onFiltersChange={onFiltersChange}
            maxPrice={maxPrice}
            onReset={handleReset}
          />
        </div>
        <SheetFooter className="pt-4 border-t">
          <Button className="w-full bg-secondary text-secondary-foreground" onClick={() => setOpen(false)}>
            Apply Filters
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
  const pills: { label: string; onRemove: () => void }[] = [];

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) {
    pills.push({
      label: `AED ${filters.priceRange[0]} - ${filters.priceRange[1]}`,
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
    <div className="flex flex-wrap gap-2 mb-4">
      {pills.map((pill, index) => (
        <Badge
          key={index}
          variant="secondary"
          className="pl-2 pr-1 py-1 flex items-center gap-1 cursor-pointer hover:bg-secondary/80"
          onClick={pill.onRemove}
        >
          {pill.label}
          <X className="w-3 h-3" />
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 text-xs text-muted-foreground"
        onClick={() => onFiltersChange(defaultFilters)}
      >
        Clear all
      </Button>
    </div>
  );
};

export default ServiceFiltersSidebar;
