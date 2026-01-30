import { Link } from "react-router-dom";
import { Star, Clock, Car, CheckCircle, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Service } from "@/lib/serviceMapper";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ServiceCardRedesignedProps {
  service: Service;
  variant?: "default" | "compact";
}

const ServiceCardRedesigned = ({ service, variant = "default" }: ServiceCardRedesignedProps) => {
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
    <Link to={detailUrl} className="group block">
      <div className="relative bg-card rounded-xl overflow-hidden border border-border/50 hover:border-secondary/30 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Image Section - 16:10 aspect ratio */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={service.imageUrl}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-60 group-hover:opacity-70 transition-opacity" />

          {/* Top Row - Badges & Save */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
            <div className="flex flex-col gap-2">
              {discount && discount > 0 && (
                <Badge className="bg-destructive text-destructive-foreground text-xs font-bold shadow-lg">
                  {discount}% OFF
                </Badge>
              )}
              {service.isFeatured && (
                <Badge className="bg-secondary text-secondary-foreground text-xs font-bold shadow-lg">
                  Popular
                </Badge>
              )}
            </div>
            
            <button
              onClick={handleSaveClick}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm",
                isSaved 
                  ? "bg-destructive text-destructive-foreground" 
                  : "bg-card/80 text-muted-foreground hover:bg-card hover:text-destructive"
              )}
            >
              <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
            </button>
          </div>

          {/* Price Tag - Bottom Right */}
          <div className="absolute bottom-3 right-3 bg-card/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg">
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-muted-foreground">From</span>
              <span className="text-lg font-bold text-secondary">
                AED {service.price.toLocaleString()}
              </span>
            </div>
            {service.originalPrice && service.originalPrice > service.price && (
              <span className="text-xs text-muted-foreground line-through">
                AED {service.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Quick Info - Bottom Left */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            {service.duration && (
              <span className="flex items-center gap-1 text-xs text-primary-foreground bg-primary/60 backdrop-blur-sm px-2 py-1 rounded-full">
                <Clock className="w-3 h-3" />
                {service.duration}
              </span>
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Category Pill */}
          {service.categoryName && (
            <span className="inline-block text-xs font-medium text-secondary bg-secondary/10 px-2 py-0.5 rounded-full mb-2">
              {service.categoryName}
            </span>
          )}

          {/* Title */}
          <h3 className="font-semibold text-base text-foreground line-clamp-2 mb-2 group-hover:text-secondary transition-colors min-h-[2.5rem]">
            {service.title}
          </h3>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="font-semibold text-sm">{service.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              ({service.reviewCount.toLocaleString()} reviews)
            </span>
          </div>

          {/* Features Row */}
          <div className="flex flex-wrap gap-2 mb-4">
            {service.hotelPickup && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Car className="w-3 h-3" />
                Pickup
              </span>
            )}
            {service.instantConfirmation && (
              <span className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-3 h-3" />
                Instant
              </span>
            )}
          </div>

          {/* CTA */}
          <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold group-hover:shadow-md transition-all">
            View Details
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCardRedesigned;
