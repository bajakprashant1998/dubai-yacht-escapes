import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Search, Grid3X3, List, Star, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ServiceCardRedesigned from "@/components/ServiceCardRedesigned";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServices, useServicesByCategory } from "@/hooks/useServices";
import { useActiveServiceCategories } from "@/hooks/useServiceCategories";
import { cn } from "@/lib/utils";
import {
  ServiceFiltersSidebar,
  ServiceFiltersDrawer,
  ActiveFilterPills,
  defaultFilters,
  type FilterState,
} from "@/components/services/ServiceFilters";

// Helper to parse duration string to hours
const parseDurationToHours = (duration: string | null): number | null => {
  if (!duration) return null;
  const lower = duration.toLowerCase();
  
  // Match patterns like "2 hours", "2-3 hours", "30 minutes", "1.5 hours"
  const hoursMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:hour|hr)/);
  const minutesMatch = lower.match(/(\d+)\s*(?:minute|min)/);
  
  let hours = 0;
  if (hoursMatch) hours += parseFloat(hoursMatch[1]);
  if (minutesMatch) hours += parseInt(minutesMatch[1]) / 60;
  
  return hours > 0 ? hours : null;
};

// Check if duration falls within a range
const isDurationInRange = (duration: string | null, range: string): boolean => {
  const hours = parseDurationToHours(duration);
  if (hours === null) return false;
  
  switch (range) {
    case "1-2": return hours >= 1 && hours <= 2;
    case "2-4": return hours > 2 && hours <= 4;
    case "4-8": return hours > 4 && hours <= 8;
    case "8+": return hours > 8;
    default: return false;
  }
};

const Services = () => {
  const { categoryPath } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Update search when URL param changes
  useEffect(() => {
    const urlQuery = searchParams.get("q");
    if (urlQuery && urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams]);

  const { data: categories, isLoading: loadingCategories } = useActiveServiceCategories();
  const { data: allServices, isLoading: loadingAll } = useServices();
  const { data: categoryServices, isLoading: loadingCategory } = useServicesByCategory(categoryPath || "");

  const services = categoryPath ? categoryServices : allServices;
  const isLoading = categoryPath ? loadingCategory : loadingAll;

  const activeCategory = categories?.find((c) => c.slug === categoryPath);

  // Calculate max price for filter
  const maxPrice = useMemo(() => {
    if (!services) return 2000;
    return Math.max(...services.map((s) => s.price), 2000);
  }, [services]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count++;
    if (filters.durations.length > 0) count += filters.durations.length;
    if (filters.minRating) count++;
    if (filters.hotelPickup) count++;
    if (filters.instantConfirmation) count++;
    return count;
  }, [filters, maxPrice]);

  // Apply all filters
  const filteredServices = useMemo(() => {
    if (!services) return [];

    return services.filter((service) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !service.title.toLowerCase().includes(query) &&
          !service.description?.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Price filter
      if (service.price < filters.priceRange[0] || service.price > filters.priceRange[1]) {
        return false;
      }

      // Duration filter
      if (filters.durations.length > 0) {
        const matchesDuration = filters.durations.some((range) =>
          isDurationInRange(service.duration, range)
        );
        if (!matchesDuration) return false;
      }

      // Rating filter
      if (filters.minRating && service.rating < filters.minRating) {
        return false;
      }

      // Hotel pickup filter
      if (filters.hotelPickup && !service.hotelPickup) {
        return false;
      }

      // Instant confirmation filter
      if (filters.instantConfirmation && !service.instantConfirmation) {
        return false;
      }

      return true;
    });
  }, [services, searchQuery, filters]);

  // Sort services
  const sortedServices = useMemo(() => {
    if (!filteredServices) return [];
    return [...filteredServices].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "popular":
        default:
          return b.reviewCount - a.reviewCount;
      }
    });
  }, [filteredServices, sortBy]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-10 bg-cover bg-center" />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30">
              Dubai Experiences
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
              {activeCategory ? activeCategory.name : "All Experiences"}
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-6">
              {activeCategory?.description ||
                "Discover the best activities and tours in Dubai - from thrilling desert safaris to world-class theme parks"}
            </p>
            <div className="flex items-center gap-4 text-primary-foreground/70 text-sm">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-secondary fill-secondary" />
                4.8 avg rating
              </span>
              <span>•</span>
              <span>{sortedServices?.length || 0} experiences</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-[72px] z-30 bg-background border-b border-border shadow-sm">
        <div className="container py-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <Button
              variant={!categoryPath ? "default" : "outline"}
              size="sm"
              onClick={() => navigate("/services")}
              className={!categoryPath ? "bg-secondary text-secondary-foreground" : ""}
            >
              All
            </Button>
            {loadingCategories ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-24" />
              ))
            ) : (
              categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={categoryPath === category.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => navigate(`/dubai/services/${category.slug}`)}
                  className={categoryPath === category.slug ? "bg-secondary text-secondary-foreground" : ""}
                >
                  {category.name}
                </Button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-8 lg:py-12">
        <div className="container">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <ServiceFiltersSidebar
              filters={filters}
              onFiltersChange={setFilters}
              maxPrice={maxPrice}
              activeFilterCount={activeFilterCount}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <ServiceFiltersDrawer
                    filters={filters}
                    onFiltersChange={setFilters}
                    maxPrice={maxPrice}
                    activeFilterCount={activeFilterCount}
                  />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="hidden sm:flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className={cn(viewMode === "grid" && "bg-muted")}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className={cn(viewMode === "list" && "bg-muted")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filter Pills */}
              <ActiveFilterPills
                filters={filters}
                onFiltersChange={setFilters}
                maxPrice={maxPrice}
              />

              {/* Results */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-96 rounded-xl" />
                  ))}
                </div>
              ) : sortedServices && sortedServices.length > 0 ? (
                <div
                  className={cn(
                    "grid gap-6",
                    viewMode === "grid"
                      ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1"
                  )}
                >
                  {sortedServices.map((service) => (
                    <ServiceCardRedesigned key={service.id} service={service} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <MapPin className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No experiences found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={() => {
                    setFilters(defaultFilters);
                    setSearchQuery("");
                  }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
