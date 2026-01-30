import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useHotels } from "@/hooks/useHotels";
import HotelCard from "@/components/hotels/HotelCard";
import HotelFilters from "@/components/hotels/HotelFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Building } from "lucide-react";

const Hotels = () => {
  const { category } = useParams();
  
  const { data: hotels = [], isLoading } = useHotels();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null);
  const [starRatingFilter, setStarRatingFilter] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      if (selectedCategory && hotel.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') !== selectedCategory) return false;
      if (starRatingFilter.length > 0 && !starRatingFilter.includes(hotel.star_rating)) return false;
      if (hotel.price_from && (hotel.price_from < priceRange[0] || hotel.price_from > priceRange[1])) return false;
      return true;
    });
  }, [hotels, selectedCategory, starRatingFilter, priceRange]);
  
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setStarRatingFilter([]);
    setPriceRange([0, 10000]);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 pt-32 pb-16">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
              <Building className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Hotels in Dubai</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the perfect accommodation for your Dubai stay. From budget-friendly options
              to world-class luxury hotels with stunning views.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
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
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : filteredHotels.length === 0 ? (
                <div className="text-center py-16 bg-background rounded-lg">
                  <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to find available hotels.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground mb-6">
                    Showing {filteredHotels.length} hotel{filteredHotels.length !== 1 ? "s" : ""}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredHotels.map((hotel) => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Hotels;