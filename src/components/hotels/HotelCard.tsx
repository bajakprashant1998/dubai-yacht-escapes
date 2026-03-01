import { Link } from "react-router-dom";
import { MapPin, Star, Wifi, Car, Dumbbell, Check, Heart, ArrowRight, Users, Coffee, Waves } from "lucide-react";
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
  const detailUrl = `/hotels/${hotel.category?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'all'}/${hotel.slug}`;

  const renderStars = (count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-3.5 h-3.5 fill-secondary text-secondary" />
    ));

  const getAmenityIcon = (amenity: string) => {
    const l = amenity.toLowerCase();
    if (l.includes("wifi")) return <Wifi className="w-3.5 h-3.5" />;
    if (l.includes("parking") || l.includes("valet")) return <Car className="w-3.5 h-3.5" />;
    if (l.includes("gym") || l.includes("fitness")) return <Dumbbell className="w-3.5 h-3.5" />;
    if (l.includes("pool") || l.includes("swim")) return <Waves className="w-3.5 h-3.5" />;
    if (l.includes("breakfast") || l.includes("dining")) return <Coffee className="w-3.5 h-3.5" />;
    return <Check className="w-3.5 h-3.5" />;
  };

  // Fake review score for visual enhancement (based on star rating)
  const reviewScore = (hotel.star_rating * 1.6 + 1.2).toFixed(1);

  if (viewMode === "list") {
    return (
      <Link to={detailUrl} className="block group">
        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 cursor-pointer card-elevated rounded-xl">
          <div className="flex flex-col md:flex-row">
            <div className="relative w-full md:w-80 aspect-[16/10] md:aspect-auto md:h-auto overflow-hidden shrink-0">
              <img
                src={hotel.image_url || "/placeholder.svg"}
                alt={hotel.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {hotel.is_featured && (
                <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground shadow-md rounded-lg">
                  ⭐ Popular Choice
                </Badge>
              )}
              <button
                className="absolute top-3 right-3 p-2 bg-background/90 backdrop-blur-sm rounded-xl hover:bg-background transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                <Heart className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
              </button>
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <div className="flex gap-0.5">{renderStars(hotel.star_rating)}</div>
                <span className="text-xs text-white/80 font-medium">{hotel.star_rating}-Star</span>
              </div>
            </div>

            <CardContent className="flex-1 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg group-hover:text-secondary transition-colors line-clamp-1">
                    {hotel.name}
                  </h3>
                  <div className="shrink-0 ml-3 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-lg">
                    {reviewScore}
                  </div>
                </div>
                {hotel.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-secondary" />
                    {hotel.location}
                  </p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{hotel.description}</p>
                {hotel.amenities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.slice(0, 5).map((amenity) => (
                      <span key={amenity} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-lg">
                        {getAmenityIcon(amenity)}
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 5 && (
                      <span className="text-xs text-secondary font-medium px-2.5 py-1">+{hotel.amenities.length - 5} more</span>
                    )}
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
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl gap-2 group/btn">
                  View Details
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  // Grid View
  return (
    <Link to={detailUrl} className="block group">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 cursor-pointer card-elevated rounded-xl h-full flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={hotel.image_url || "/placeholder.svg"}
            alt={hotel.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          {hotel.is_featured && (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground shadow-md rounded-lg text-xs">
              ⭐ Popular
            </Badge>
          )}
          <button
            className="absolute top-3 right-3 p-2 bg-background/90 backdrop-blur-sm rounded-xl hover:bg-background transition-colors opacity-0 group-hover:opacity-100"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
          </button>

          {/* Bottom overlay info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
            <div className="flex gap-0.5">{renderStars(hotel.star_rating)}</div>
            <div className="bg-secondary text-secondary-foreground text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
              {reviewScore}
            </div>
          </div>
        </div>

        <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="font-semibold text-lg group-hover:text-secondary transition-colors line-clamp-1">
              {hotel.name}
            </h3>
            {hotel.location && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                <MapPin className="w-3 h-3 text-secondary" />
                {hotel.location}
              </p>
            )}
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{hotel.description}</p>
          </div>

          {hotel.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {hotel.amenities.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-xs font-normal gap-1 rounded-lg">
                  {getAmenityIcon(amenity)}
                  {amenity}
                </Badge>
              ))}
              {hotel.amenities.length > 3 && (
                <Badge variant="outline" className="text-xs font-normal rounded-lg">
                  +{hotel.amenities.length - 3}
                </Badge>
              )}
            </div>
          )}

          <div className="pt-3 flex items-center justify-between border-t border-border/50">
            <div>
              {hotel.price_from ? (
                <>
                  <span className="text-xs text-muted-foreground">From</span>
                  <span className="text-xl font-bold text-secondary ml-1">
                    AED {hotel.price_from.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">/night</span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">Contact for price</span>
              )}
            </div>
            <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl gap-1.5 group/btn">
              View
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default HotelCard;
