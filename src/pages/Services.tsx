import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Search, Filter, Grid3X3, List, Star, Clock, MapPin, ChevronDown } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ServiceCard from "@/components/ServiceCard";
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

const Services = () => {
  const { categoryPath } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: categories, isLoading: loadingCategories } = useActiveServiceCategories();
  const { data: allServices, isLoading: loadingAll } = useServices();
  const { data: categoryServices, isLoading: loadingCategory } = useServicesByCategory(categoryPath || "");

  const services = categoryPath ? categoryServices : allServices;
  const isLoading = categoryPath ? loadingCategory : loadingAll;

  const activeCategory = categories?.find((c) => c.slug === categoryPath);

  // Filter by search
  const filteredServices = services?.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort services
  const sortedServices = filteredServices?.sort((a, b) => {
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
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
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
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
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

          {/* Results */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-xl" />
              ))}
            </div>
          ) : sortedServices && sortedServices.length > 0 ? (
            <div
              className={cn(
                "grid gap-6",
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              )}
            >
              {sortedServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <MapPin className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No experiences found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or browse all experiences
              </p>
              <Button onClick={() => navigate("/services")}>
                View All Experiences
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Services;
