import { useState } from "react";
import { useCarCategories, CarCategory } from "@/hooks/useCarCategories";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X } from "lucide-react";

interface CarFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  transmissionFilter: string[];
  onTransmissionChange: (transmission: string[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

const CarFilters = ({
  selectedCategory,
  onCategoryChange,
  transmissionFilter,
  onTransmissionChange,
  priceRange,
  onPriceRangeChange,
  onClearFilters,
}: CarFiltersProps) => {
  const { data: categories = [] } = useCarCategories();
  
  const transmissionOptions = ["Automatic", "Manual"];
  
  const handleTransmissionToggle = (transmission: string) => {
    if (transmissionFilter.includes(transmission)) {
      onTransmissionChange(transmissionFilter.filter((t) => t !== transmission));
    } else {
      onTransmissionChange([...transmissionFilter, transmission]);
    }
  };
  
  const hasActiveFilters = selectedCategory || transmissionFilter.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000;
  
  return (
    <Card className="sticky top-24">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Categories */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Category</Label>
          <div className="space-y-2">
            <Button
              variant={selectedCategory === null ? "secondary" : "ghost"}
              size="sm"
              className="w-full justify-start"
              onClick={() => onCategoryChange(null)}
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => onCategoryChange(category.slug)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Transmission */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Transmission</Label>
          <div className="space-y-2">
            {transmissionOptions.map((transmission) => (
              <div key={transmission} className="flex items-center space-x-2">
                <Checkbox
                  id={transmission}
                  checked={transmissionFilter.includes(transmission)}
                  onCheckedChange={() => handleTransmissionToggle(transmission)}
                />
                <label
                  htmlFor={transmission}
                  className="text-sm cursor-pointer"
                >
                  {transmission}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Daily Price (AED)</Label>
          <Slider
            value={priceRange}
            min={0}
            max={5000}
            step={50}
            onValueChange={(value) => onPriceRangeChange(value as [number, number])}
            className="mt-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>AED {priceRange[0]}</span>
            <span>AED {priceRange[1]}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarFilters;