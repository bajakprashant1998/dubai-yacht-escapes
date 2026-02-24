import { Link } from "react-router-dom";
import { Clock, Star, CheckCircle, Car, ArrowRight, Heart, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Service } from "@/lib/serviceMapper";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCurrency } from "@/hooks/useCurrency";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link to={detailUrl} className="group block h-full">
        <div className="relative h-full bg-card rounded-2xl overflow-hidden border border-border/40 hover:border-secondary/40 shadow-sm hover:shadow-2xl hover:shadow-secondary/5 transition-all duration-500 hover:-translate-y-1.5 flex flex-col">
          {/* Image Section */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={service.imageUrl}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                {discount && discount > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground text-[11px] font-bold shadow-lg shadow-destructive/25 px-2.5 py-0.5">
                    {discount}% OFF
                  </Badge>
                )}
                {service.isFeatured && (
                  <Badge className="bg-secondary text-secondary-foreground text-[11px] font-bold shadow-lg shadow-secondary/25 px-2.5 py-0.5">
                    <Zap className="w-3 h-3 mr-1" />
                    Best Seller
                  </Badge>
                )}
              </div>

              <button
                onClick={handleSaveClick}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-lg",
                  isSaved
                    ? "bg-destructive text-destructive-foreground scale-110"
                    : "bg-card/60 text-card-foreground hover:bg-card/90 hover:text-destructive"
                )}
              >
                <Heart className={cn("w-4 h-4 transition-transform", isSaved && "fill-current scale-110")} />
              </button>
            </div>

            {/* Bottom info pills on image */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
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
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            {/* Category pill */}
            {service.categoryName && (
              <span className="inline-block w-fit text-[11px] font-semibold uppercase tracking-wider text-secondary bg-secondary/10 px-2.5 py-1 rounded-full mb-2">
                {service.categoryName}
              </span>
            )}

            {/* Title */}
            <h3 className="font-bold text-base text-foreground line-clamp-2 group-hover:text-secondary transition-colors mb-1.5 min-h-[2.5rem]">
              {service.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 bg-secondary/10 px-2 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                <span className="font-bold text-sm text-secondary">{service.rating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({service.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Features */}
            {service.hotelPickup && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                <Car className="w-3.5 h-3.5 text-secondary" />
                <span>Hotel Pickup Included</span>
              </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Divider */}
            <div className="border-t border-dashed border-border/60 my-3" />

            {/* Price & CTA */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] text-muted-foreground mb-0.5">From</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-secondary">
                    {formatPrice(service.price)}
                  </span>
                </div>
                {service.originalPrice && service.originalPrice > service.price && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(service.originalPrice)}
                  </span>
                )}
              </div>

              <Button
                size="sm"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl gap-1.5 font-semibold shadow-md shadow-secondary/15 transition-all duration-300 group-hover:gap-2.5"
              >
                Details
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;
