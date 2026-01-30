import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useHotels } from "@/hooks/useHotels";
import HotelCard from "@/components/hotels/HotelCard";
import HotelFilters from "@/components/hotels/HotelFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, Grid3X3, List, MapPin } from "lucide-react";
import { SortingTabs } from "@/components/ui/sorting-tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Star Rating" },
];

const Hotels = () => {
  const { category } = useParams();
  
  const { data: hotels = [], isLoading } = useHotels();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null);
  const [starRatingFilter, setStarRatingFilter] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState("recommended");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const filteredAndSortedHotels = useMemo(() => {
    let result = hotels.filter((hotel) => {
      if (selectedCategory && hotel.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') !== selectedCategory) return false;
      if (starRatingFilter.length > 0 && !starRatingFilter.includes(hotel.star_rating)) return false;
      if (hotel.price_from && (hotel.price_from < priceRange[0] || hotel.price_from > priceRange[1])) return false;
      return true;
    });
    
    // Apply sorting
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => (a.price_from || 0) - (b.price_from || 0));
        break;
      case "price-high":
        result = [...result].sort((a, b) => (b.price_from || 0) - (a.price_from || 0));
        break;
      case "rating":
        result = [...result].sort((a, b) => b.star_rating - a.star_rating);
        break;
      default:
        // Recommended: featured first, then by rating
        result = [...result].sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return b.star_rating - a.star_rating;
        });
    }
    
    return result;
  }, [hotels, selectedCategory, starRatingFilter, priceRange, sortBy]);
  
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setStarRatingFilter([]);
    setPriceRange([0, 10000]);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 pt-28 pb-16">
        <div className="container">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="w-4 h-4" />
              <span>Dubai, United Arab Emirates</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Hotels in Dubai</h1>
            <p className="text-muted-foreground">
              Discover {hotels.length} exceptional hotels for your Dubai stay
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <HotelFilters
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                starRatingFilter={starRatingFilter}
                onStarRatingChange={setStarRatingFilter}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                onClearFilters={handleClearFilters}
              />
            </div>
            
            {/* Hotel Grid */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-card rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{filteredAndSortedHotels.length}</span> hotels found
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <SortingTabs
                    options={sortOptions}
                    value={sortBy}
                    onChange={setSortBy}
                    className="hidden md:flex"
                  />
                  <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Mobile Sorting */}
              <div className="md:hidden mb-4">
                <SortingTabs
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  className="w-full overflow-x-auto"
                />
              </div>
              
              {isLoading ? (
                <div className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                )}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : filteredAndSortedHotels.length === 0 ? (
                <div className="text-center py-16 bg-card rounded-xl border border-border">
                  <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to find available hotels.
                  </p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <div className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                )}>
                  {filteredAndSortedHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} viewMode={viewMode} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Hotels;