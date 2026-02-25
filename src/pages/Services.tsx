import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Grid3X3, List, Star, MapPin, TrendingUp, ArrowUpDown, ThumbsUp, Sparkles, Compass, SlidersHorizontal, Shield, Clock, Users } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ServiceCardRedesigned from "@/components/ServiceCardRedesigned";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SortingTabs, type SortOption } from "@/components/ui/sorting-tabs";
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
import SEOHead from "@/components/SEOHead";

const sortOptions: SortOption[] = [
  { value: "popular", label: "Recommended", icon: TrendingUp },
  { value: "price-low", label: "Price: Low", icon: ArrowUpDown },
  { value: "price-high", label: "Price: High", icon: ArrowUpDown },
  { value: "rating", label: "Top Rated", icon: ThumbsUp },
];

const parseDurationToHours = (duration: string | null): number | null => {
  if (!duration) return null;
  const lower = duration.toLowerCase();
  const hoursMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:hour|hr)/);
  const minutesMatch = lower.match(/(\d+)\s*(?:minute|min)/);
  let hours = 0;
  if (hoursMatch) hours += parseFloat(hoursMatch[1]);
  if (minutesMatch) hours += parseInt(minutesMatch[1]) / 60;
  return hours > 0 ? hours : null;
};

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

  const maxPrice = useMemo(() => {
    if (!services) return 2000;
    return Math.max(...services.map((s) => s.price), 2000);
  }, [services]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count++;
    if (filters.durations.length > 0) count += filters.durations.length;
    if (filters.minRating) count++;
    if (filters.hotelPickup) count++;
    if (filters.instantConfirmation) count++;
    return count;
  }, [filters, maxPrice]);

  const filteredServices = useMemo(() => {
    if (!services) return [];
    return services.filter((service) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!service.title.toLowerCase().includes(query) && !service.description?.toLowerCase().includes(query)) return false;
      }
      if (service.price < filters.priceRange[0] || service.price > filters.priceRange[1]) return false;
      if (filters.durations.length > 0) {
        const matchesDuration = filters.durations.some((range) => isDurationInRange(service.duration, range));
        if (!matchesDuration) return false;
      }
      if (filters.minRating && service.rating < filters.minRating) return false;
      if (filters.hotelPickup && !service.hotelPickup) return false;
      if (filters.instantConfirmation && !service.instantConfirmation) return false;
      return true;
    });
  }, [services, searchQuery, filters]);

  const sortedServices = useMemo(() => {
    if (!filteredServices) return [];
    return [...filteredServices].sort((a, b) => {
      switch (sortBy) {
        case "price-low": return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "rating": return b.rating - a.rating;
        case "popular":
        default: return b.reviewCount - a.reviewCount;
      }
    });
  }, [filteredServices, sortBy]);

  const bannerImage = activeCategory?.imageUrl || "/assets/services/city-tours.jpg";

  return (
    <Layout>
      <SEOHead
        title={activeCategory ? `${activeCategory.name} - Dubai Services` : "Dubai Services & Experiences"}
        description="Explore 100+ curated Dubai experiences including desert safaris, theme parks, water sports, and more."
      />

      {/* Hero */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 bg-primary overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center transition-all duration-700 scale-105"
          style={{ backgroundImage: `url(${bannerImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-primary/75 to-primary" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-primary/50" />

        {/* Decorative */}
        <div className="absolute top-16 right-[8%] w-96 h-96 bg-secondary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-[5%] w-72 h-72 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/15 border border-secondary/20 rounded-full mb-5 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium text-secondary">Dubai Experiences</span>
              </div>
            </motion.div>

            <motion.h1
              className="text-4xl lg:text-6xl font-display font-bold text-primary-foreground mb-4 tracking-tight"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {activeCategory ? activeCategory.name : (
                <>Explore Dubai's <span className="text-secondary">Best Adventures</span></>
              )}
            </motion.h1>

            <motion.p
              className="text-lg lg:text-xl text-primary-foreground/70 mb-8 leading-relaxed max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {activeCategory?.description ||
                "From thrilling desert safaris to world-class theme parks — discover 100+ curated experiences"}
            </motion.p>

            {/* Trust Stats */}
            <motion.div
              className="flex items-center gap-5 flex-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              {[
                { icon: Star, label: "Avg Rating", value: "4.8", iconFill: true },
                { icon: Compass, label: "Experiences", value: String(sortedServices?.length || 0) },
                { icon: Shield, label: "Best Price", value: "Guaranteed" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-secondary/15 flex items-center justify-center backdrop-blur-sm">
                    <stat.icon className={cn("w-4 h-4 text-secondary", stat.iconFill && "fill-secondary")} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-primary-foreground">{stat.value}</p>
                    <p className="text-[11px] text-primary-foreground/50">{stat.label}</p>
                  </div>
                  {i < 2 && <div className="w-px h-8 bg-primary-foreground/10 ml-3" />}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="sticky top-[72px] z-30 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => navigate("/services")}
              className={cn(
                "flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border",
                !categoryPath
                  ? "bg-secondary text-secondary-foreground border-secondary shadow-md shadow-secondary/20"
                  : "bg-transparent text-muted-foreground border-border hover:border-secondary/40 hover:text-foreground"
              )}
            >
              All Experiences
            </button>
            {loadingCategories ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-28 rounded-full flex-shrink-0" />
              ))
            ) : (
              categories?.map((category) => (
                <button
                  key={category.id}
                  onClick={() => navigate(`/dubai/services/${category.slug}`)}
                  className={cn(
                    "flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border whitespace-nowrap",
                    categoryPath === category.slug
                      ? "bg-secondary text-secondary-foreground border-secondary shadow-md shadow-secondary/20"
                      : "bg-transparent text-muted-foreground border-border hover:border-secondary/40 hover:text-foreground"
                  )}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 lg:py-12 bg-muted/20">
        <div className="container">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <ServiceFiltersSidebar
              filters={filters}
              onFiltersChange={setFilters}
              maxPrice={maxPrice}
              activeFilterCount={activeFilterCount}
            />

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Results Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 p-4 rounded-2xl bg-card border border-border/40 shadow-sm">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold text-foreground">
                    {activeCategory ? activeCategory.name : "All Experiences"}
                  </h2>
                  <Badge className="bg-secondary/10 text-secondary border-0 text-xs font-bold px-2.5">
                    {sortedServices?.length || 0} results
                  </Badge>
                </div>
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-10 text-sm rounded-xl border-border/50 bg-muted/30 focus:bg-card transition-colors"
                  />
                </div>
              </div>

              {/* Sort & View */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <SortingTabs
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  className="flex-1"
                />
                <div className="flex items-center gap-2">
                  <ServiceFiltersDrawer
                    filters={filters}
                    onFiltersChange={setFilters}
                    maxPrice={maxPrice}
                    activeFilterCount={activeFilterCount}
                  />
                  <div className="hidden sm:flex items-center border border-border/40 rounded-xl bg-card shadow-sm overflow-hidden">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "h-9 px-3 rounded-none transition-colors",
                        viewMode === "grid" && "bg-secondary/10 text-secondary"
                      )}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <div className="w-px h-5 bg-border/40" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "h-9 px-3 rounded-none transition-colors",
                        viewMode === "list" && "bg-secondary/10 text-secondary"
                      )}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              <ActiveFilterPills
                filters={filters}
                onFiltersChange={setFilters}
                maxPrice={maxPrice}
              />

              {/* Results Grid */}
              {isLoading ? (
                <div className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                )}>
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className={cn("rounded-2xl", viewMode === "grid" ? "h-[420px]" : "h-[200px]")} />
                  ))}
                </div>
              ) : sortedServices && sortedServices.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${viewMode}-${sortBy}-${categoryPath}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "grid gap-6",
                      viewMode === "grid"
                        ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                        : "grid-cols-1"
                    )}
                  >
                    {sortedServices.map((service) => (
                      <ServiceCardRedesigned
                        key={service.id}
                        service={service}
                        viewMode={viewMode}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-24"
                >
                  <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-5">
                    <MapPin className="w-10 h-10 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">No experiences found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Try adjusting your filters or search query to discover amazing experiences
                  </p>
                  <Button
                    onClick={() => {
                      setFilters(defaultFilters);
                      setSearchQuery("");
                    }}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-semibold"
                  >
                    Clear All Filters
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
