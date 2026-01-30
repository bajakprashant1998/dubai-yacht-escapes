import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCarRentals } from "@/hooks/useCarRentals";
import { useCarCategories } from "@/hooks/useCarCategories";
import CarCard from "@/components/car-rentals/CarCard";
import CarFilters from "@/components/car-rentals/CarFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Car } from "lucide-react";

const CarRentals = () => {
  const { categorySlug } = useParams();
  const { data: cars = [], isLoading } = useCarRentals();
  const { data: categories = [] } = useCarCategories();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categorySlug || null);
  const [transmissionFilter, setTransmissionFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  
  const filteredCars = useMemo(() => {
    return cars.filter((car) => {
      if (selectedCategory && car.category?.slug !== selectedCategory) return false;
      if (transmissionFilter.length > 0 && !transmissionFilter.includes(car.transmission)) return false;
      if (car.daily_price < priceRange[0] || car.daily_price > priceRange[1]) return false;
      return true;
    });
  }, [cars, selectedCategory, transmissionFilter, priceRange]);
  
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setTransmissionFilter([]);
    setPriceRange([0, 5000]);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 pt-32 pb-16">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
              <Car className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Car Rentals in Dubai</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our wide selection of vehicles - from economy cars to luxury supercars.
              Daily, weekly, and monthly rentals available with or without driver.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <CarFilters
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                transmissionFilter={transmissionFilter}
                onTransmissionChange={setTransmissionFilter}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                onClearFilters={handleClearFilters}
              />
            </div>
            
            {/* Car Grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[16/10] w-full rounded-lg" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              ) : filteredCars.length === 0 ? (
                <div className="text-center py-16 bg-background rounded-lg">
                  <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No cars found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to find available vehicles.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground mb-6">
                    Showing {filteredCars.length} vehicle{filteredCars.length !== 1 ? "s" : ""}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredCars.map((car) => (
                      <CarCard key={car.id} car={car} />
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

export default CarRentals;