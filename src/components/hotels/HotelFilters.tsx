import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X, Star } from "lucide-react";

interface HotelFiltersProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  starRatingFilter: number[];
  onStarRatingChange: (ratings: number[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

const hotelCategories = [
  { value: "budget", label: "Budget" },
  { value: "3-star", label: "3-Star" },
  { value: "4-star", label: "4-Star" },
  { value: "5-star", label: "5-Star" },
  { value: "luxury", label: "Luxury" },
];

const HotelFilters = ({
  selectedCategory,
  onCategoryChange,
  starRatingFilter,
  onStarRatingChange,
  priceRange,
  onPriceRangeChange,
  onClearFilters,
}: HotelFiltersProps) => {
  const handleStarRatingToggle = (rating: number) => {
    if (starRatingFilter.includes(rating)) {
      onStarRatingChange(starRatingFilter.filter((r) => r !== rating));
    } else {
      onStarRatingChange([...starRatingFilter, rating]);
    }
  };
  
  const hasActiveFilters = selectedCategory || starRatingFilter.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000;
  
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
              All Hotels
            </Button>
            {hotelCategories.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "secondary" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => onCategoryChange(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Star Rating */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Star Rating</Label>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`star-${rating}`}
                  checked={starRatingFilter.includes(rating)}
                  onCheckedChange={() => handleStarRatingToggle(rating)}
                />
                <label
                  htmlFor={`star-${rating}`}
                  className="text-sm cursor-pointer flex items-center gap-1"
                >
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Price Range */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Price per Night (AED)</Label>
          <Slider
            value={priceRange}
            min={0}
            max={10000}
            step={100}
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

export default HotelFilters;