import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import HotelFilters from "./HotelFilters";

interface HotelFiltersDrawerProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  starRatingFilter: number[];
  onStarRatingChange: (ratings: number[]) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

const HotelFiltersDrawer = ({
  selectedCategory,
  onCategoryChange,
  starRatingFilter,
  onStarRatingChange,
  priceRange,
  onPriceRangeChange,
  onClearFilters,
}: HotelFiltersDrawerProps) => {
  const [open, setOpen] = useState(false);

  const activeFilterCount = 
    (selectedCategory ? 1 : 0) + 
    starRatingFilter.length + 
    (priceRange[0] > 0 || priceRange[1] < 10000 ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 lg:hidden">
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs px-1.5">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:max-w-md p-0 overflow-y-auto">
        <SheetHeader className="p-4 border-b border-border sticky top-0 bg-background z-10">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-secondary" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {activeFilterCount}
                </Badge>
              )}
            </SheetTitle>
            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onClearFilters();
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="p-4 pb-safe">
          <HotelFilters
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => {
              onCategoryChange(cat);
            }}
            starRatingFilter={starRatingFilter}
            onStarRatingChange={onStarRatingChange}
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
            onClearFilters={onClearFilters}
          />
        </div>

        <div className="sticky bottom-0 p-4 bg-background border-t border-border pb-safe">
          <Button
            className="w-full"
            onClick={() => setOpen(false)}
          >
            Show Results
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default HotelFiltersDrawer;
