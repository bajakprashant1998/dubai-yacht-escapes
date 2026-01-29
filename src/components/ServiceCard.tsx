import { Link } from "react-router-dom";
import { Clock, MapPin, Star, Users, CheckCircle, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Service } from "@/lib/serviceMapper";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const discount = service.originalPrice
    ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
    : null;

  const detailUrl = service.categorySlug
    ? `/dubai/services/${service.categorySlug}/${service.slug}`
    : `/services/${service.slug}`;

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 bg-card">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={service.imageUrl}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        {service.categoryName && (
          <Badge className="absolute top-3 left-3 bg-primary/90 text-primary-foreground">
            {service.categoryName}
          </Badge>
        )}

        {/* Discount Badge */}
        {discount && discount > 0 && (
          <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
            {discount}% OFF
          </Badge>
        )}

        {/* Quick Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-3 text-white text-sm">
            {service.duration && (
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {service.duration}
              </span>
            )}
            {service.instantConfirmation && (
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Instant
              </span>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title & Rating */}
        <div className="space-y-1">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-secondary transition-colors">
            {service.title}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-medium">{service.rating.toFixed(1)}</span>
            </div>
            <span className="text-muted-foreground">
              ({service.reviewCount.toLocaleString()} reviews)
            </span>
          </div>
        </div>

        {/* Description */}
        {service.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {service.description}
          </p>
        )}

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {service.hotelPickup && (
            <Badge variant="outline" className="text-xs">
              <Car className="w-3 h-3 mr-1" />
              Hotel Pickup
            </Badge>
          )}
          {service.maxParticipants && (
            <Badge variant="outline" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              Max {service.maxParticipants}
            </Badge>
          )}
          {service.meetingPoint && (
            <Badge variant="outline" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              Meeting Point
            </Badge>
          )}
        </div>

        {/* Price & CTA */}
        <div className="flex items-end justify-between pt-2 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">
                AED {service.price.toLocaleString()}
              </span>
              {service.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  AED {service.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {service.bookingType === "per_person" && "per person"}
              {service.bookingType === "per_group" && "per group"}
              {service.bookingType === "per_vehicle" && "per vehicle"}
            </p>
          </div>
          <Link to={detailUrl}>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
