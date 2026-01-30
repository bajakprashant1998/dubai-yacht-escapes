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
import CarFilters from "./CarFilters";

interface CarFiltersDrawerProps {
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

const CarFiltersDrawer = ({
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
}: CarFiltersDrawerProps) => {
  const [open, setOpen] = useState(false);

  const activeFilterCount = [
    selectedCategory ? 1 : 0,
    transmissionFilter.length,
    seatsFilter.length,
    fuelTypeFilter.length,
    driverFilter.length,
    priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

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
          <CarFilters
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => {
              onCategoryChange(cat);
            }}
            transmissionFilter={transmissionFilter}
            onTransmissionChange={onTransmissionChange}
            priceRange={priceRange}
            onPriceRangeChange={onPriceRangeChange}
            seatsFilter={seatsFilter}
            onSeatsChange={onSeatsChange}
            fuelTypeFilter={fuelTypeFilter}
            onFuelTypeChange={onFuelTypeChange}
            driverFilter={driverFilter}
            onDriverChange={onDriverChange}
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

export default CarFiltersDrawer;
