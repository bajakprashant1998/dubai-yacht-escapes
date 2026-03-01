import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { useCarRentals } from "@/hooks/useCarRentals";
import { useCarCategories } from "@/hooks/useCarCategories";
import CarCard from "@/components/car-rentals/CarCard";
import CarFilters from "@/components/car-rentals/CarFilters";
import CarFiltersDrawer from "@/components/car-rentals/CarFiltersDrawer";
import CarHeroStats from "@/components/car-rentals/CarHeroStats";
import CarCategoryNav from "@/components/car-rentals/CarCategoryNav";
import WhyRentWithUs from "@/components/car-rentals/WhyRentWithUs";
import { Skeleton } from "@/components/ui/skeleton";
import { Car, Grid3X3, List, MapPin, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SortingTabs } from "@/components/ui/sorting-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredAndSortedCars = useMemo(() => {
    let result = cars.filter((car) => {
      if (selectedCategory && car.category?.slug !== selectedCategory) return false;
      if (transmissionFilter.length > 0 && !transmissionFilter.includes(car.transmission)) return false;
      if (car.daily_price < priceRange[0] || car.daily_price > priceRange[1]) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!car.title.toLowerCase().includes(q) && !car.brand.toLowerCase().includes(q) && !car.model.toLowerCase().includes(q)) return false;
      }
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
  }, [cars, selectedCategory, transmissionFilter, priceRange, sortBy, searchQuery]);
  
  const handleClearFilters = () => {
    setSelectedCategory(null);
    setTransmissionFilter([]);
    setPriceRange([0, 5000]);
    setSearchQuery("");
  };

  return (
    <Layout>
      <SEOHead
        title="Car Rentals in Dubai | Premium Fleet from AED 150/day"
        description="Rent luxury, economy, and SUV cars in Dubai with free delivery, full insurance, and 24/7 support. Browse 200+ vehicles."
        canonical="/car-rentals"
        keywords={["car rental dubai", "rent a car dubai", "luxury car rental", "cheap car hire dubai"]}
      />

      {/* Enhanced Hero */}
      <section className="relative bg-primary py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,hsl(var(--secondary)/0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,hsl(var(--secondary)/0.08),transparent_50%)]" />
        </div>
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
        
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30 text-sm px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Premium Fleet • Free Delivery
              </Badge>
            </motion.div>
            <motion.h1
              className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-4 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Drive Dubai in
              <span className="text-secondary"> Style</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-primary-foreground/70 mb-6 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Choose from {cars.length > 0 ? cars.length : "200"}+ vehicles — economy to supercars — with free delivery, full insurance, and 24/7 roadside assistance.
            </motion.p>

            {/* Hero search */}
            <motion.div
              className="relative max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by brand, model, or name…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-13 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 rounded-xl text-base backdrop-blur-sm focus:bg-primary-foreground/15"
              />
            </motion.div>
          </div>

          <CarHeroStats />
        </div>
      </section>

      {/* Category quick nav */}
      <div className="bg-muted/30 border-b border-border/50">
        <div className="container py-4">
          <CarCategoryNav selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </div>
      </div>

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

            {/* Filters Sidebar */}
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
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-card rounded-xl border border-border/50"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-bold text-foreground">{filteredAndSortedCars.length}</span> vehicles found
                  </p>
                  {searchQuery && (
                    <Badge variant="outline" className="text-xs">
                      "{searchQuery}"
                      <button onClick={() => setSearchQuery("")} className="ml-1 hover:text-destructive">×</button>
                    </Badge>
                  )}
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
                      <Skeleton className="aspect-[16/10] w-full rounded-xl" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-10 w-full rounded-xl" />
                    </div>
                  ))}
                </div>
              ) : filteredAndSortedCars.length === 0 ? (
                <motion.div
                  className="text-center py-20 bg-card rounded-2xl border border-border/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                    <Car className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No vehicles found</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Try adjusting your filters or search query to find available vehicles.
                  </p>
                  <Button variant="outline" onClick={handleClearFilters} className="rounded-xl">
                    Clear all filters
                  </Button>
                </motion.div>
              ) : (
                <div className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                )}>
                  {filteredAndSortedCars.map((car, i) => (
                    <motion.div
                      key={car.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.05, 0.3) }}
                    >
                      <CarCard car={car} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Why Rent With Us */}
      <WhyRentWithUs />
    </Layout>
  );
};

export default CarRentals;
