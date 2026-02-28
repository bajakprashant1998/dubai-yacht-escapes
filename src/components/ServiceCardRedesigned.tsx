import { Link } from "react-router-dom";
import { Star, Clock, Car, CheckCircle, Heart, ArrowRight, MapPin, Users, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Service } from "@/lib/serviceMapper";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCurrency } from "@/hooks/useCurrency";

interface ServiceCardRedesignedProps {
  service: Service;
  variant?: "default" | "compact";
  viewMode?: "grid" | "list";
}

const ServiceCardRedesigned = ({ service, variant = "default", viewMode = "grid" }: ServiceCardRedesignedProps) => {
  const { formatPrice } = useCurrency();
  const [isSaved, setIsSaved] = useState(false);

  const discount = service.originalPrice
    ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
    : null;

  const detailUrl = service.categorySlug
    ? `/dubai/services/${service.categorySlug}/${service.slug}`
    : `/services/${service.slug}`;

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  // List View Layout
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35 }}
      >
        <Link to={detailUrl} className="group block">
          <div className="relative card-elevated card-shine bg-card rounded-2xl overflow-hidden transition-all duration-500 flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative w-full sm:w-80 h-52 sm:h-auto shrink-0 overflow-hidden">
              <img
                src={service.imageUrl}
                alt={service.title}
                className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/10" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {discount && discount > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground text-[11px] font-bold shadow-lg px-2 py-0.5">
                    {discount}% OFF
                  </Badge>
                )}
                {service.isFeatured && (
                  <Badge className="bg-secondary text-secondary-foreground text-[11px] font-bold shadow-lg px-2 py-0.5">
                    <Zap className="w-3 h-3 mr-1" />
                    Best Seller
                  </Badge>
                )}
              </div>

              {/* Save */}
              <button
                onClick={handleSaveClick}
                className={cn(
                  "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-md",
                  isSaved
                    ? "bg-destructive text-destructive-foreground scale-110"
                    : "bg-card/70 text-muted-foreground hover:bg-card/95 hover:text-destructive"
                )}
              >
                <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-5 flex flex-col justify-between">
              <div>
                {service.categoryName && (
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full mb-2">
                    {service.categoryName}
                  </span>
                )}
                <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-secondary transition-colors line-clamp-2">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {service.description}
                </p>

                {/* Meta pills */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {service.duration && (
                    <span className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-secondary" />
                      {service.duration}
                    </span>
                  )}
                  {service.hotelPickup && (
                    <span className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg">
                      <Car className="w-3.5 h-3.5 text-secondary" />
                      Pickup
                    </span>
                  )}
                  {service.instantConfirmation && (
                    <span className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg">
                      <CheckCircle className="w-3.5 h-3.5 text-secondary" />
                      Instant
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom */}
              <div className="flex items-end justify-between mt-4 pt-4 border-t border-dashed border-border/50">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex items-center gap-1 bg-secondary/10 px-2 py-0.5 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                      <span className="font-bold text-sm text-secondary">{service.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({service.reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-muted-foreground">From</span>
                    <span className="text-2xl font-extrabold text-secondary">
                      {formatPrice(service.price)}
                    </span>
                    {service.originalPrice && service.originalPrice > service.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatPrice(service.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold rounded-xl gap-2 shadow-md shadow-secondary/15 transition-all group-hover:shadow-lg">
                  View Details
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid View Layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35 }}
    >
      <Link to={detailUrl} className="group block h-full">
        <div className="relative h-full card-elevated card-shine bg-card rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-500 flex flex-col">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={service.imageUrl}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />

            {/* Top badges & save */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                {discount && discount > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground text-[11px] font-bold shadow-lg shadow-destructive/20 px-2 py-0.5">
                    {discount}% OFF
                  </Badge>
                )}
                {service.isFeatured && (
                  <Badge className="bg-secondary text-secondary-foreground text-[11px] font-bold shadow-lg shadow-secondary/20 px-2 py-0.5">
                    <Zap className="w-3 h-3 mr-1" />
                    Best Seller
                  </Badge>
                )}
              </div>
              <button
                onClick={handleSaveClick}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-md",
                  isSaved
                    ? "bg-destructive text-destructive-foreground scale-110"
                    : "bg-card/60 text-card-foreground hover:bg-card/90 hover:text-destructive"
                )}
              >
                <Heart className={cn("w-4 h-4 transition-transform", isSaved && "fill-current scale-110")} />
              </button>
            </div>

            {/* Bottom pills on image */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div className="flex items-center gap-2">
                {service.duration && (
                  <span className="flex items-center gap-1 text-xs font-medium text-primary-foreground bg-primary/50 backdrop-blur-md px-2.5 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    {service.duration}
                  </span>
                )}
                {service.instantConfirmation && (
                  <span className="flex items-center gap-1 text-xs font-medium text-primary-foreground bg-primary/50 backdrop-blur-md px-2.5 py-1 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    Instant
                  </span>
                )}
              </div>

              {/* Rating pill on image */}
              <div className="flex items-center gap-1 bg-card/90 backdrop-blur-md px-2 py-1 rounded-full shadow-sm">
                <Star className="w-3 h-3 fill-secondary text-secondary" />
                <span className="text-xs font-bold text-foreground">{service.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            {service.categoryName && (
              <span className="inline-block w-fit text-[11px] font-semibold uppercase tracking-wider text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full mb-2">
                {service.categoryName}
              </span>
            )}

            <h3 className="font-bold text-[15px] text-foreground line-clamp-2 group-hover:text-secondary transition-colors mb-1.5 min-h-[2.5rem] leading-snug">
              {service.title}
            </h3>

            {/* Review count */}
            <p className="text-xs text-muted-foreground mb-3">
              {service.reviewCount.toLocaleString()} reviews
            </p>

            {/* Features */}
            {service.hotelPickup && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                <Car className="w-3.5 h-3.5 text-secondary" />
                <span>Hotel Pickup Included</span>
              </div>
            )}

            <div className="flex-1" />

            {/* Divider */}
            <div className="border-t border-dashed border-border/50 my-3" />

            {/* Price & CTA */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">From</p>
                <span className="text-xl font-extrabold text-secondary">
                  {formatPrice(service.price)}
                </span>
                {service.originalPrice && service.originalPrice > service.price && (
                  <span className="ml-1.5 text-xs text-muted-foreground line-through">
                    {formatPrice(service.originalPrice)}
                  </span>
                )}
              </div>

              <Button
                size="sm"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl gap-1.5 font-semibold shadow-md shadow-secondary/15 transition-all duration-300 group-hover:gap-2.5"
              >
                Book
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ServiceCardRedesigned;
