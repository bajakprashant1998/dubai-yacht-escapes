import { Link } from "react-router-dom";
import { Clock, Star, CheckCircle, Car, ArrowRight, Heart, Zap, Sparkles } from "lucide-react";
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
        <div className="relative h-full card-elevated card-shine bg-card rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-500 flex flex-col">
          {/* Image Section */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={service.imageUrl}
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-500" />

            {/* Top badges */}
            <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
              <div className="flex flex-col gap-1.5">
                {discount && discount > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground text-[11px] font-bold shadow-lg shadow-destructive/30 px-2.5 py-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {discount}% OFF
                  </Badge>
                )}
                {service.isFeatured && (
                  <Badge className="bg-secondary text-secondary-foreground text-[11px] font-bold shadow-lg shadow-secondary/30 px-2.5 py-1">
                    <Zap className="w-3 h-3 mr-1" />
                    Best Seller
                  </Badge>
                )}
              </div>

              <button
                onClick={handleSaveClick}
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-lg border border-white/10",
                  isSaved
                    ? "bg-destructive text-destructive-foreground scale-110"
                    : "bg-card/60 text-card-foreground hover:bg-card/90 hover:text-destructive hover:scale-110"
                )}
              >
                <Heart className={cn("w-4 h-4 transition-transform", isSaved && "fill-current scale-110")} />
              </button>
            </div>

            {/* Bottom pills on image */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <div className="flex items-center gap-2">
                {service.duration && (
                  <span className="flex items-center gap-1 text-xs font-medium text-primary-foreground bg-card/20 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
                    <Clock className="w-3 h-3" />
                    {service.duration}
                  </span>
                )}
                {service.instantConfirmation && (
                  <span className="flex items-center gap-1 text-xs font-medium text-primary-foreground bg-card/20 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
                    <CheckCircle className="w-3 h-3" />
                    Instant
                  </span>
                )}
              </div>
              {/* Rating pill */}
              <div className="flex items-center gap-1 bg-card/90 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-md border border-border/30">
                <Star className="w-3.5 h-3.5 fill-secondary text-secondary" />
                <span className="text-xs font-bold text-foreground">{service.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            {/* Category pill */}
            {service.categoryName && (
              <span className="inline-block w-fit text-[11px] font-semibold uppercase tracking-wider text-secondary bg-secondary/10 px-2.5 py-1 rounded-full mb-2.5">
                {service.categoryName}
              </span>
            )}

            {/* Title */}
            <h3 className="font-bold text-base text-foreground line-clamp-2 group-hover:text-secondary transition-colors duration-300 mb-1.5 min-h-[2.5rem]">
              {service.title}
            </h3>

            {/* Reviews */}
            <p className="text-xs text-muted-foreground mb-3">
              {service.reviewCount.toLocaleString()} reviews
            </p>

            {/* Features */}
            {service.hotelPickup && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 bg-muted/40 w-fit px-2.5 py-1.5 rounded-lg">
                <Car className="w-3.5 h-3.5 text-secondary" />
                <span>Hotel Pickup Included</span>
              </div>
            )}

            <div className="flex-1" />

            {/* Divider */}
            <div className="border-t border-border/40 my-3" />

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
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl gap-1.5 font-semibold shadow-md shadow-secondary/15 transition-all duration-300 group-hover:gap-2.5 group-hover:shadow-lg group-hover:shadow-secondary/20"
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
