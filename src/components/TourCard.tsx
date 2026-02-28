import { memo } from "react";
import { Link } from "react-router-dom";
import { Star, Clock, Users, ChevronRight, Ship, Ticket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Tour } from "@/lib/tourMapper";
import { getTourUrl } from "@/lib/seoUtils";
import WishlistButton from "@/components/WishlistButton";
import { useCurrency } from "@/hooks/useCurrency";
import { motion } from "framer-motion";

interface TourCardProps {
  tour: Tour;
  featured?: boolean;
}

const categoryLabels: Record<string, string> = {
  "dhow-cruise": "Dhow Cruise",
  "yacht-shared": "Shared Yacht",
  "yacht-private": "Private Charter",
  "megayacht": "Megayacht",
};

const TourCard = memo(({ tour, featured = false }: TourCardProps) => {
  const { formatPrice } = useCurrency();
  const discount = Math.round((1 - tour.price / tour.originalPrice) * 100);
  const isPrivateCharter = tour.fullYachtPrice && tour.fullYachtPrice > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45 }}
    >
      <Link to={getTourUrl(tour)} className="group block h-full">
        <div className={`card-elevated card-shine bg-card rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-500 h-full flex flex-col ${featured ? 'lg:flex-row' : ''}`}>
          {/* Image */}
          <div className={`relative overflow-hidden ${featured ? 'lg:w-1/2 lg:min-h-[300px]' : ''}`}>
            <OptimizedImage
              src={tour.image}
              alt={tour.title}
              aspectRatio={featured ? undefined : "4/3"}
              sizes={featured ? "(max-width: 1024px) 100vw, 50vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
              className="group-hover:scale-110 transition-transform duration-700 ease-out"
              containerClassName={featured ? "h-full min-h-[200px]" : ""}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-500" />

            {/* Discount Badge */}
            {discount > 0 && (
              <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1.5 rounded-full text-xs font-bold z-10 shadow-lg shadow-destructive/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {discount}% OFF
              </div>
            )}
            {/* Wishlist */}
            <WishlistButton tourId={tour.id} className="absolute top-4 right-4" size="sm" />
            {/* Private Charter Badge */}
            {isPrivateCharter && (
              <div className="absolute top-14 right-4 bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10 shadow-lg shadow-secondary/30">
                <Ship className="w-3 h-3" />
                Private
              </div>
            )}
            {/* Category Badge */}
            <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-md text-foreground px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 z-10 shadow-md border border-border/30">
              <Ship className="w-3 h-3 text-secondary" />
              {categoryLabels[tour.category]}
            </div>
            {/* Rating on image */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-card/90 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-md border border-border/30 z-10">
              <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
              <span className="text-xs font-bold text-foreground">{tour.rating}</span>
            </div>
          </div>

          {/* Content */}
          <div className={`p-5 flex flex-col flex-1 ${featured ? 'lg:w-1/2 lg:p-8' : ''}`}>
            <div className="flex-1">
              <p className="text-secondary text-xs font-semibold uppercase tracking-wider mb-1.5">{tour.subtitle}</p>
              <h3 className="font-display text-base sm:text-lg font-bold text-foreground mb-2.5 group-hover:text-secondary transition-colors duration-300 line-clamp-2">
                {tour.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                {tour.description}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1.5 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-secondary" />
                  {tour.duration}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1.5 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                  {tour.rating} ({tour.reviewCount.toLocaleString()})
                </span>
                {tour.capacity && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1.5 rounded-lg">
                    <Users className="w-3.5 h-3.5 text-secondary" />
                    {tour.capacity}
                  </span>
                )}
              </div>

              {/* Highlights Preview */}
              {featured && (
                <div className="hidden lg:block mb-6">
                  <ul className="grid grid-cols-2 gap-2">
                    {tour.highlights.slice(0, 4).map((highlight, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                        <span className="line-clamp-1">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Price & CTA */}
            <div className="flex items-end justify-between pt-4 border-t border-border/50 mt-auto">
              <div>
                {isPrivateCharter ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-extrabold text-foreground">{formatPrice(tour.fullYachtPrice!)}</span>
                    </div>
                    <p className="text-secondary text-xs font-semibold flex items-center gap-1 mt-0.5">
                      <Ship className="w-3 h-3" />
                      Per Hour
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[11px] text-muted-foreground mb-0.5">From</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl sm:text-2xl font-extrabold text-secondary">{formatPrice(tour.price)}</span>
                      {tour.originalPrice > tour.price && (
                        <span className="text-muted-foreground line-through text-xs">
                          {formatPrice(tour.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-[11px] flex items-center gap-1 mt-0.5">
                      <Ticket className="w-3 h-3" />
                      {tour.pricingType === "per_hour" ? "per hour" : "per person"}
                    </p>
                  </>
                )}
              </div>
              <Button
                size="sm"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl gap-1.5 font-semibold shadow-md shadow-secondary/15 transition-all duration-300 group-hover:gap-2.5 group-hover:shadow-lg group-hover:shadow-secondary/20"
              >
                Details
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

TourCard.displayName = "TourCard";

export default TourCard;
