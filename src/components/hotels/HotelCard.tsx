import { Link } from "react-router-dom";
import { MapPin, Star, Wifi, Car, Dumbbell, Check, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hotel } from "@/hooks/useHotels";
import { cn } from "@/lib/utils";

interface HotelCardProps {
  hotel: Hotel;
  viewMode?: "grid" | "list";
}

const HotelCard = ({ hotel, viewMode = "grid" }: HotelCardProps) => {
  const renderStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-3.5 h-3.5 fill-secondary text-secondary" />
    ));
  };

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes("wifi")) return <Wifi className="w-3.5 h-3.5" />;
    if (lowerAmenity.includes("parking")) return <Car className="w-3.5 h-3.5" />;
    if (lowerAmenity.includes("gym") || lowerAmenity.includes("fitness")) return <Dumbbell className="w-3.5 h-3.5" />;
    return <Check className="w-3.5 h-3.5" />;
  };

  if (viewMode === "list") {
    return (
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-72 aspect-[16/10] md:aspect-auto md:h-auto overflow-hidden shrink-0">
            <img
              src={hotel.image_url || "/placeholder.svg"}
              alt={hotel.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {hotel.is_featured && (
              <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground shadow-md">
                Popular
              </Badge>
            )}
            <button className="absolute top-3 right-3 p-2 bg-background/90 rounded-full hover:bg-background transition-colors">
              <Heart className="w-4 h-4 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
          
          <CardContent className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1">
                {renderStars(hotel.star_rating)}
                <span className="text-xs text-muted-foreground ml-2">{hotel.star_rating}-Star Hotel</span>
              </div>
              <h3 className="font-semibold text-lg mb-1 group-hover:text-secondary transition-colors">
                {hotel.name}
              </h3>
              {hotel.location && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5" />
                  {hotel.location}
                </p>
              )}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {hotel.description}
              </p>
              {hotel.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.slice(0, 5).map((amenity) => (
                    <span key={amenity} className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      {getAmenityIcon(amenity)}
                      {amenity}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-end justify-between mt-4 pt-4 border-t border-border/50">
              <div>
                {hotel.price_from && (
                  <>
                    <span className="text-xs text-muted-foreground">From</span>
                    <p className="text-2xl font-bold text-secondary">
                      AED {hotel.price_from.toLocaleString()}
                    </p>
                    <span className="text-xs text-muted-foreground">per night</span>
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
        </div>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={hotel.image_url || "/placeholder.svg"}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {hotel.is_featured && (
          <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground shadow-md">
            Popular
          </Badge>
        )}
        <button className="absolute top-3 right-3 p-2 bg-background/90 rounded-full hover:bg-background transition-colors opacity-0 group-hover:opacity-100">
          <Heart className="w-4 h-4 text-muted-foreground hover:text-destructive" />
        </button>
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
            {hotel.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity} variant="outline" className="text-xs font-normal">
                {getAmenityIcon(amenity)}
                <span className="ml-1">{amenity}</span>
              </Badge>
            ))}
            {hotel.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{hotel.amenities.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="pt-3 flex items-center justify-between border-t border-border/50">
          <div>
            {hotel.price_from && (
              <>
                <span className="text-xs text-muted-foreground">From</span>
                <span className="text-xl font-bold text-secondary ml-1">
                  AED {hotel.price_from.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">/night</span>
              </>
            )}
          </div>
          <Link to={`/hotels/${hotel.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/${hotel.slug}`}>
            <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelCard;