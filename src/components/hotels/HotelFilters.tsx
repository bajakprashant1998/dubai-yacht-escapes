import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, X, Star, ChevronDown, ChevronUp, Wifi, Car, Dumbbell, Waves, UtensilsCrossed } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  { value: "budget", label: "Budget Friendly", emoji: "💰" },
  { value: "3-star", label: "3-Star Hotels", emoji: "🏨" },
  { value: "4-star", label: "4-Star Hotels", emoji: "🌟" },
  { value: "5-star", label: "5-Star Hotels", emoji: "👑" },
  { value: "luxury", label: "Luxury Resorts", emoji: "🏖️" },
];

const SectionToggle = ({ open }: { open: boolean }) =>
  open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />;

const HotelFilters = ({
  selectedCategory,
  onCategoryChange,
  starRatingFilter,
  onStarRatingChange,
  priceRange,
  onPriceRangeChange,
  onClearFilters,
}: HotelFiltersProps) => {
  const [openSections, setOpenSections] = useState({
    category: true,
    rating: true,
    price: true,
  });

  const handleStarRatingToggle = (rating: number) => {
    if (starRatingFilter.includes(rating)) {
      onStarRatingChange(starRatingFilter.filter((r) => r !== rating));
    } else {
      onStarRatingChange([...starRatingFilter, rating]);
    }
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hasActiveFilters = selectedCategory || starRatingFilter.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000;
  const activeFilterCount = (selectedCategory ? 1 : 0) + starRatingFilter.length + (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0);

  return (
    <Card className="sticky top-24 shadow-sm rounded-xl border-border/50">
      <CardHeader className="pb-3 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-4 h-4 text-secondary" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 px-2.5 py-0.5 text-xs font-bold bg-secondary text-secondary-foreground rounded-full">
                {activeFilterCount}
              </span>
            )}
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-7 text-xs text-muted-foreground hover:text-foreground">
              <X className="w-3 h-3 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Categories */}
        <Collapsible open={openSections.category} onOpenChange={() => toggleSection("category")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
            <Label className="text-sm font-semibold cursor-pointer">Hotel Type</Label>
            <SectionToggle open={openSections.category} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-1">
              <button
                type="button"
                onClick={() => onCategoryChange(null)}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all",
                  selectedCategory === null
                    ? "bg-secondary/10 text-secondary font-medium border border-secondary/20"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                🏢 All Hotels
              </button>
              {hotelCategories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => onCategoryChange(cat.value)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all",
                    selectedCategory === cat.value
                      ? "bg-secondary/10 text-secondary font-medium border border-secondary/20"
                      : "text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="border-t border-border" />

        {/* Star Rating */}
        <Collapsible open={openSections.rating} onOpenChange={() => toggleSection("rating")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
            <Label className="text-sm font-semibold cursor-pointer">Star Rating</Label>
            <SectionToggle open={openSections.rating} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleStarRatingToggle(rating)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm transition-all",
                      starRatingFilter.includes(rating)
                        ? "border-secondary bg-secondary/10 text-secondary font-medium shadow-sm"
                        : "border-border hover:border-secondary/50 text-muted-foreground"
                    )}
                  >
                    {rating}
                    <Star
                      className={cn(
                        "w-3.5 h-3.5",
                        starRatingFilter.includes(rating) ? "fill-secondary text-secondary" : "text-muted-foreground"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="border-t border-border" />

        {/* Price Range */}
        <Collapsible open={openSections.price} onOpenChange={() => toggleSection("price")}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-muted/50 transition-colors">
            <Label className="text-sm font-semibold cursor-pointer">Price per Night</Label>
            <SectionToggle open={openSections.price} />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="px-4 pb-4 space-y-4">
              <Slider
                value={priceRange}
                min={0}
                max={10000}
                step={100}
                onValueChange={(value) => onPriceRangeChange(value as [number, number])}
                className="mt-2"
              />
              <div className="flex justify-between items-center">
                <div className="px-3 py-1.5 bg-muted rounded-xl text-sm font-medium">
                  AED {priceRange[0].toLocaleString()}
                </div>
                <span className="text-muted-foreground text-xs">to</span>
                <div className="px-3 py-1.5 bg-muted rounded-xl text-sm font-medium">
                  AED {priceRange[1].toLocaleString()}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default HotelFilters;
