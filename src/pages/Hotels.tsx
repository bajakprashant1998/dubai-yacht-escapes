import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { useHotels } from "@/hooks/useHotels";
import HotelCard from "@/components/hotels/HotelCard";
import HotelFilters from "@/components/hotels/HotelFilters";
import HotelFiltersDrawer from "@/components/hotels/HotelFiltersDrawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, Grid3X3, List, Star, MapPin, Shield, Clock, BadgePercent, Search, Sparkles, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SortingTabs } from "@/components/ui/sorting-tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Star Rating" },
];

const trustItems = [
  { icon: Shield, label: "Best Price Guarantee" },
  { icon: Clock, label: "Instant Confirmation" },
  { icon: BadgePercent, label: "Exclusive Deals" },
  { icon: Sparkles, label: "Handpicked Properties" },
];

const Hotels = () => {
  const { category } = useParams();
  const { data: hotels = [], isLoading } = useHotels();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(category || null);
  const [starRatingFilter, setStarRatingFilter] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState("recommended");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAndSortedHotels = useMemo(() => {
    let result = hotels.filter((hotel) => {
      if (selectedCategory && hotel.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') !== selectedCategory) return false;
      if (starRatingFilter.length > 0 && !starRatingFilter.includes(hotel.star_rating)) return false;
      if (hotel.price_from && (hotel.price_from < priceRange[0] || hotel.price_from > priceRange[1])) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!hotel.name.toLowerCase().includes(q) && !hotel.location?.toLowerCase().includes(q) && !hotel.description?.toLowerCase().includes(q)) return false;
      }
      return true;
    });

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
        result = [...result].sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return b.star_rating - a.star_rating;
        });
    }
    return result;
  }, [hotels, selectedCategory, starRatingFilter, priceRange, sortBy, searchQuery]);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setStarRatingFilter([]);
    setPriceRange([0, 10000]);
    setSearchQuery("");
  };

  return (
    <Layout>
      <SEOHead
        title="Luxury Hotels in Dubai | Best Deals & Exclusive Rates"
        description="Browse handpicked luxury hotels in Dubai with exclusive rates. From 3-star comfort to 5-star opulence, find your perfect stay with instant confirmation."
        canonical="/hotels"
      />

      {/* Hero Section */}
      <section className="relative bg-primary py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,hsl(var(--secondary)/0.15),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,hsl(var(--secondary)/0.08),transparent_50%)]" />
        </div>
        <div className="absolute top-10 left-[10%] w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-[5%] w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Badge className="mb-5 bg-secondary/20 text-secondary border-secondary/30 text-sm px-4 py-2 rounded-xl">
              <Building className="w-4 h-4 mr-2" />
              Premium Stays in Dubai
            </Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-foreground mb-5 leading-tight">
              Find Your Perfect
              <span className="block text-secondary">Dubai Hotel</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 mb-8 max-w-2xl leading-relaxed">
              Discover {hotels.length}+ handpicked properties — from boutique gems to iconic 5-star resorts along the Arabian Gulf.
            </p>

            {/* Hero Search */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by hotel name, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 rounded-xl bg-card/95 backdrop-blur-sm border-border/50 text-foreground text-base shadow-lg placeholder:text-muted-foreground"
              />
            </div>
          </motion.div>

          {/* Stats Strip */}
          <motion.div
            className="flex flex-wrap items-center gap-6 mt-10 text-primary-foreground/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-secondary" />
              Dubai, UAE
            </span>
            <span className="w-1 h-1 rounded-full bg-primary-foreground/30" />
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-secondary fill-secondary" />
              3–5 Star Properties
            </span>
            <span className="w-1 h-1 rounded-full bg-primary-foreground/30" />
            <span className="font-medium text-primary-foreground/80">{hotels.length} properties</span>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center justify-between gap-6 overflow-x-auto scrollbar-hide">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap shrink-0">
                <item.icon className="w-4 h-4 text-secondary" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="min-h-screen bg-muted/30 py-8 pb-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Mobile Filter Drawer */}
            <div className="lg:hidden mb-2">
              <HotelFiltersDrawer
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                starRatingFilter={starRatingFilter}
                onStarRatingChange={setStarRatingFilter}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Filters Sidebar */}
            <div className="hidden lg:block lg:col-span-1 space-y-4">
              <HotelFilters
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                starRatingFilter={starRatingFilter}
                onStarRatingChange={setStarRatingFilter}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                onClearFilters={handleClearFilters}
              />

              {/* Need Help Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-card rounded-xl border border-border p-5 space-y-3"
              >
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <Phone className="w-4 h-4 text-secondary" />
                  Need Help Choosing?
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our travel experts can help you find the perfect hotel for your Dubai trip.
                </p>
                <Button
                  size="sm"
                  className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl"
                  asChild
                >
                  <a href="https://wa.me/971509254594?text=Hi!%20I%20need%20help%20choosing%20a%20hotel%20in%20Dubai." target="_blank" rel="noopener noreferrer">
                    Chat on WhatsApp
                  </a>
                </Button>
              </motion.div>
            </div>

            {/* Hotel Grid */}
            <div className="lg:col-span-3">
              {/* Toolbar */}
              <motion.div
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 p-4 bg-card rounded-xl border border-border"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-bold text-foreground text-base">{filteredAndSortedHotels.length}</span>{" "}
                    hotels found
                  </p>
                  {(searchQuery || selectedCategory || starRatingFilter.length > 0) && (
                    <Button variant="ghost" size="sm" onClick={handleClearFilters} className="text-xs h-7 text-muted-foreground">
                      Clear all
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <SortingTabs
                    options={sortOptions}
                    value={sortBy}
                    onChange={setSortBy}
                    className="hidden md:flex"
                  />
                  <div className="flex items-center gap-1 p-1 bg-muted rounded-xl">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon"
                      className="h-8 w-8 rounded-lg"
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
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                )}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="bg-card rounded-xl border border-border overflow-hidden">
                      <Skeleton className="aspect-[16/10] w-full" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-border/50">
                          <Skeleton className="h-7 w-28" />
                          <Skeleton className="h-9 w-20 rounded-xl" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredAndSortedHotels.length === 0 ? (
                <motion.div
                  className="text-center py-20 bg-card rounded-xl border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Building className="w-14 h-14 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Try adjusting your filters or search to find available hotels.
                  </p>
                  <Button variant="outline" onClick={handleClearFilters} className="rounded-xl">
                    Clear all filters
                  </Button>
                </motion.div>
              ) : (
                <div className={cn(
                  "grid gap-6",
                  viewMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                )}>
                  {filteredAndSortedHotels.map((hotel, i) => (
                    <motion.div
                      key={hotel.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <HotelCard hotel={hotel} viewMode={viewMode} />
                    </motion.div>
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
