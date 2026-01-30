import { Link } from "react-router-dom";
import { MapPin, Star, Wifi, Car, Dumbbell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hotel } from "@/hooks/useHotels";

interface HotelCardProps {
  hotel: Hotel;
}

const HotelCard = ({ hotel }: HotelCardProps) => {
  const renderStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    ));
  };

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes("wifi")) return <Wifi className="w-4 h-4" />;
    if (lowerAmenity.includes("parking")) return <Car className="w-4 h-4" />;
    if (lowerAmenity.includes("gym") || lowerAmenity.includes("fitness")) return <Dumbbell className="w-4 h-4" />;
    return null;
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={hotel.image_url || "/placeholder.svg"}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {hotel.is_featured && (
          <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
            Featured
          </Badge>
        )}
        <div className="absolute bottom-3 left-3 flex gap-0.5">
          {renderStars(hotel.star_rating)}
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg group-hover:text-secondary transition-colors line-clamp-1">
            {hotel.name}
          </h3>
          {hotel.location && (
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {hotel.location}
            </p>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {hotel.description}
        </p>
        
        {hotel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hotel.amenities.slice(0, 4).map((amenity) => (
              <Badge key={amenity} variant="outline" className="text-xs">
                {getAmenityIcon(amenity)}
                <span className="ml-1">{amenity}</span>
              </Badge>
            ))}
            {hotel.amenities.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{hotel.amenities.length - 4} more
              </Badge>
            )}
          </div>
        )}
        
        <div className="pt-2 flex items-center justify-between">
          <div>
            {hotel.price_from && (
              <>
                <span className="text-sm text-muted-foreground">From</span>
                <span className="text-xl font-bold text-secondary ml-2">
                  AED {hotel.price_from}
                </span>
                <span className="text-sm text-muted-foreground">/night</span>
              </>
            )}
          </div>
          <Link to={`/hotels/${hotel.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${hotel.slug}`}>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelCard;