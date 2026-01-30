import { Link } from "react-router-dom";
import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useServices } from "@/hooks/useServices";
import { useTours } from "@/hooks/useTours";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ExperienceItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  duration: string | null;
  categorySlug?: string;
  type: "tour" | "service";
}

const FeaturedExperiences = memo(() => {
  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: tours, isLoading: toursLoading } = useTours();

  const isLoading = servicesLoading || toursLoading;

  // Combine featured services and tours
  const featuredItems: ExperienceItem[] = [];

  // Add featured services
  services
    ?.filter((s) => s.isFeatured)
    ?.slice(0, 6)
    ?.forEach((service) => {
      featuredItems.push({
        id: service.id,
        slug: service.slug,
        title: service.title,
        description: service.description,
        price: service.price,
        originalPrice: service.originalPrice,
        imageUrl: service.imageUrl,
        rating: service.rating,
        reviewCount: service.reviewCount,
        duration: service.duration,
        categorySlug: service.categorySlug,
        type: "service",
      });
    });

  // Add featured tours
  tours
    ?.filter((t) => t.featured)
    ?.slice(0, 4)
    ?.forEach((tour) => {
      featuredItems.push({
        id: tour.id,
        slug: tour.slug,
        title: tour.title,
        description: tour.description,
        price: tour.price,
        originalPrice: tour.originalPrice,
        imageUrl: tour.image || "/placeholder.svg",
        rating: tour.rating,
        reviewCount: tour.reviewCount,
        duration: tour.duration,
        type: "tour",
      });
    });

  if (isLoading) {
    return (
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="text-center mb-10">
            <Skeleton className="h-8 w-72 mx-auto mb-3" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredItems.length === 0) return null;

  const getDetailUrl = (item: ExperienceItem) => {
    if (item.type === "tour") {
      return `/tours/${item.slug}`;
    }
    return `/dubai/services/${item.categorySlug || "general"}/${item.slug}`;
  };

  return (
    <section className="py-12 md:py-20">
      <div className="container">
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <Badge className="mb-3 bg-secondary/10 text-secondary border-secondary/20">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending Now
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Featured Experiences
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Our most popular tours and activities, handpicked for unforgettable memories
            </p>
          </div>
          <Link to="/experiences" className="mt-4 md:mt-0">
            <Button variant="outline" className="group">
              View All
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {featuredItems.map((item, index) => (
              <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link to={getDetailUrl(item)} className="group block">
                    <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-muted">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />

                      {/* Price Badge */}
                      <div className="absolute top-3 right-3 bg-card/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 shadow-lg">
                        <span className="text-sm font-bold text-secondary">
                          AED {item.price}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs text-muted-foreground line-through ml-1">
                            {item.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Discount Badge */}
                      {item.originalPrice && item.originalPrice > item.price && (
                        <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground">
                          {Math.round((1 - item.price / item.originalPrice) * 100)}% OFF
                        </Badge>
                      )}

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-semibold text-primary-foreground line-clamp-2 mb-2 group-hover:text-secondary transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-3 text-primary-foreground/80 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                            <span className="font-medium">{item.rating.toFixed(1)}</span>
                            <span className="text-primary-foreground/60">
                              ({item.reviewCount})
                            </span>
                          </div>
                          {item.duration && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{item.duration}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4" />
          <CarouselNext className="hidden md:flex -right-4" />
        </Carousel>
      </div>
    </section>
  );
});

FeaturedExperiences.displayName = "FeaturedExperiences";

export default FeaturedExperiences;
