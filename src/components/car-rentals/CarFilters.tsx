import { useState } from "react";
import { useCarCategories } from "@/hooks/useCarCategories";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Filter, X, ChevronDown, Car, Users, Fuel, UserCheck, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CarFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  transmissionFilter: string[];
  onTransmissionChange: (transmission: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  seatsFilter?: number[];
  onSeatsChange?: (seats: number[]) => void;
  fuelTypeFilter?: string[];
  onFuelTypeChange?: (fuelTypes: string[]) => void;
  driverFilter?: string[];
  onDriverChange?: (options: string[]) => void;
  onClearFilters: () => void;
}

const seatOptions = [2, 4, 5, 7];
const fuelTypeOptions = ["Petrol", "Diesel", "Electric", "Hybrid"];
const driverOptions = [
  { value: "with-driver", label: "With Driver", icon: UserCheck },
  { value: "self-drive", label: "Self Drive", icon: Car },
];

const CarFilters = ({
  selectedCategory,
  onCategoryChange,
  transmissionFilter,
  onTransmissionChange,
  priceRange,
  onPriceRangeChange,
  seatsFilter = [],
  onSeatsChange,
  fuelTypeFilter = [],
  onFuelTypeChange,
  driverFilter = [],
  onDriverChange,
  onClearFilters,
}: CarFiltersProps) => {
  const { data: categories = [] } = useCarCategories();
  
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    transmission: true,
    seats: false,
    fuelType: false,
    features: false,
  });
  
  const transmissionOptions = ["Automatic", "Manual"];
  
  const handleTransmissionToggle = (transmission: string) => {
    if (transmissionFilter.includes(transmission)) {
      onTransmissionChange(transmissionFilter.filter((t) => t !== transmission));
    } else {
      onTransmissionChange([...transmissionFilter, transmission]);
    }
  };

  const handleSeatsToggle = (seats: number) => {
    if (!onSeatsChange) return;
    if (seatsFilter.includes(seats)) {
      onSeatsChange(seatsFilter.filter((s) => s !== seats));
    } else {
      onSeatsChange([...seatsFilter, seats]);
    }
  };

  const handleFuelTypeToggle = (fuelType: string) => {
    if (!onFuelTypeChange) return;
    if (fuelTypeFilter.includes(fuelType)) {
      onFuelTypeChange(fuelTypeFilter.filter((f) => f !== fuelType));
    } else {
      onFuelTypeChange([...fuelTypeFilter, fuelType]);
    }
  };

  const handleDriverToggle = (option: string) => {
    if (!onDriverChange) return;
    if (driverFilter.includes(option)) {
      onDriverChange(driverFilter.filter((d) => d !== option));
    } else {
      onDriverChange([...driverFilter, option]);
    }
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };
  
  const activeFilterCount = [
    selectedCategory ? 1 : 0,
    transmissionFilter.length,
    seatsFilter.length,
    fuelTypeFilter.length,
    driverFilter.length,
    priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);
  
  return (
    <Card className="sticky top-24 border-border/50">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5 text-secondary" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </CardTitle>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0 divide-y divide-border/50">
        {/* Categories Section */}
        <Collapsible open={openSections.category} onOpenChange={() => toggleSection("category")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
            <Label className="text-sm font-semibold cursor-pointer">Category</Label>
            <div className="flex items-center gap-2">
              {selectedCategory && (
                <Badge variant="outline" className="text-xs">{categories.find(c => c.slug === selectedCategory)?.name}</Badge>
              )}
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", openSections.category && "rotate-180")} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-1">
              <Button
                variant={selectedCategory === null ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => onCategoryChange(null)}
              >
                <Car className="w-4 h-4" />
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.slug ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => onCategoryChange(category.slug)}
                >
                  <Car className="w-4 h-4" />
                  {category.name}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Price Range Section */}
        <Collapsible open={openSections.price} onOpenChange={() => toggleSection("price")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
            <Label className="text-sm font-semibold cursor-pointer">Daily Price (AED)</Label>
            <div className="flex items-center gap-2">
              {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                <Badge variant="outline" className="text-xs">{priceRange[0]} - {priceRange[1]}</Badge>
              )}
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", openSections.price && "rotate-180")} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <Slider
              value={priceRange}
              min={0}
              max={5000}
              step={50}
              onValueChange={(value) => onPriceRangeChange(value as [number, number])}
              className="mt-2"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-3">
              <span className="px-2 py-1 bg-muted rounded">AED {priceRange[0]}</span>
              <span className="px-2 py-1 bg-muted rounded">AED {priceRange[1]}</span>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Transmission Section */}
        <Collapsible open={openSections.transmission} onOpenChange={() => toggleSection("transmission")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
            <Label className="text-sm font-semibold cursor-pointer">Transmission</Label>
            <div className="flex items-center gap-2">
              {transmissionFilter.length > 0 && (
                <Badge variant="outline" className="text-xs">{transmissionFilter.length}</Badge>
              )}
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", openSections.transmission && "rotate-180")} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {transmissionOptions.map((transmission) => (
                <Button
                  key={transmission}
                  variant={transmissionFilter.includes(transmission) ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleTransmissionToggle(transmission)}
                  className="gap-1"
                >
                  <Zap className="w-3 h-3" />
                  {transmission}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Seats Section */}
        <Collapsible open={openSections.seats} onOpenChange={() => toggleSection("seats")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
            <Label className="text-sm font-semibold cursor-pointer">Seats</Label>
            <div className="flex items-center gap-2">
              {seatsFilter.length > 0 && (
                <Badge variant="outline" className="text-xs">{seatsFilter.length}</Badge>
              )}
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", openSections.seats && "rotate-180")} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="flex flex-wrap gap-2">
              {seatOptions.map((seats) => (
                <Button
                  key={seats}
                  variant={seatsFilter.includes(seats) ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleSeatsToggle(seats)}
                  className="gap-1 min-w-[60px]"
                >
                  <Users className="w-3 h-3" />
                  {seats === 7 ? "7+" : seats}
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Fuel Type Section */}
        <Collapsible open={openSections.fuelType} onOpenChange={() => toggleSection("fuelType")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
            <Label className="text-sm font-semibold cursor-pointer">Fuel Type</Label>
            <div className="flex items-center gap-2">
              {fuelTypeFilter.length > 0 && (
                <Badge variant="outline" className="text-xs">{fuelTypeFilter.length}</Badge>
              )}
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", openSections.fuelType && "rotate-180")} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-2">
              {fuelTypeOptions.map((fuelType) => (
                <div key={fuelType} className="flex items-center space-x-2">
                  <Checkbox
                    id={fuelType}
                    checked={fuelTypeFilter.includes(fuelType)}
                    onCheckedChange={() => handleFuelTypeToggle(fuelType)}
                  />
                  <label htmlFor={fuelType} className="text-sm cursor-pointer flex items-center gap-2">
                    <Fuel className="w-3.5 h-3.5 text-muted-foreground" />
                    {fuelType}
                  </label>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Features Section */}
        <Collapsible open={openSections.features} onOpenChange={() => toggleSection("features")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
            <Label className="text-sm font-semibold cursor-pointer">Features</Label>
            <div className="flex items-center gap-2">
              {driverFilter.length > 0 && (
                <Badge variant="outline" className="text-xs">{driverFilter.length}</Badge>
              )}
              <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", openSections.features && "rotate-180")} />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
            <div className="space-y-2">
              {driverOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={driverFilter.includes(option.value)}
                      onCheckedChange={() => handleDriverToggle(option.value)}
                    />
                    <label htmlFor={option.value} className="text-sm cursor-pointer flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      {option.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default CarFilters;