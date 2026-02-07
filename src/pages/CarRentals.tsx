import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useCarRentals } from "@/hooks/useCarRentals";
import { useCarCategories } from "@/hooks/useCarCategories";
import CarCard from "@/components/car-rentals/CarCard";
import CarFilters from "@/components/car-rentals/CarFilters";
import CarFiltersDrawer from "@/components/car-rentals/CarFiltersDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, Grid3X3, List, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SortingTabs } from "@/components/ui/sorting-tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

const CarRentals = () => {
  const { categorySlug } = useParams();
  const { data: cars = [], isLoading } = useCarRentals();
  const { data: categories = [] } = useCarCategories();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categorySlug || null);
  const [transmissionFilter, setTransmissionFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState("recommended");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const filteredAndSortedCars = useMemo(() => {
    let result = cars.filter((car) => {
      if (selectedCategory && car.category?.slug !== selectedCategory) return false;
      if (transmissionFilter.length > 0 && !transmissionFilter.includes(car.transmission)) return false;
      if (car.daily_price < priceRange[0] || car.daily_price > priceRange[1]) return false;
      return true;
    });
    
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.daily_price - b.daily_price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.daily_price - a.daily_price);
        break;
      case "newest":
        result = [...result].sort((a, b) => b.year - a.year);
        break;
      default:
        result = [...result].sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return b.year - a.year;
        });
    }
    
    return result;
  }, [cars, selectedCategory, transmissionFilter, priceRange, sortBy]);
  
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setTransmissionFilter([]);
    setPriceRange([0, 5000]);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-primary py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
        <div className="absolute top-16 right-[10%] w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-[5%] w-48 h-48 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30 text-sm px-4 py-2">
              <Car className="w-4 h-4 mr-2" />
              Premium Fleet
            </Badge>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Car Rentals in Dubai
          </motion.h1>
          <motion.p
            className="text-lg text-primary-foreground/80 mb-6 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Explore {cars.length} vehicles — from economy to supercars
          </motion.p>
          <motion.div
            className="flex items-center gap-4 text-primary-foreground/70 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-secondary" />
              Dubai, UAE
            </span>
            <span>•</span>
            <span>{categories.length} categories</span>
            <span>•</span>
            <span>{cars.length} vehicles</span>
          </motion.div>
        </div>
      </section>

      <div className="min-h-screen bg-muted/30 py-8 pb-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Mobile Filter Drawer */}
            <div className="lg:hidden mb-4">
              <CarFiltersDrawer
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                transmissionFilter={transmissionFilter}
                onTransmissionChange={setTransmissionFilter}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Filters Sidebar - Desktop Only */}
            <div className="hidden lg:block lg:col-span-1">
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
              {/* Toolbar */}
              <motion.div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-card rounded-xl border border-border"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{filteredAndSortedCars.length}</span> vehicles found
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
              </motion.div>
              
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
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
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
              ) : filteredAndSortedCars.length === 0 ? (
                <motion.div
                  className="text-center py-16 bg-card rounded-xl border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Car className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No cars found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters to find available vehicles.
                  </p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear all filters
                  </Button>
                </motion.div>
              ) : (
                <div className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                )}>
                  {filteredAndSortedCars.map((car) => (
                    <CarCard key={car.id} car={car} />
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

export default CarRentals;
