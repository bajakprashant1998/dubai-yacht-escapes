import { Link } from "react-router-dom";
import { Car, Users, Fuel, Settings2, ArrowRight, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CarRental } from "@/hooks/useCarRentals";

interface CarCardProps {
  car: CarRental;
}

const CarCard = ({ car }: CarCardProps) => {
  const categorySlug = car.category?.slug || "all";
  const detailUrl = `/car-rentals/${categorySlug}/${car.slug}`;
  const originalPrice = Math.round(car.daily_price * 1.2);
  
  return (
    <Link to={detailUrl} className="block group">
      <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 border-border/50 cursor-pointer hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={car.image_url || "/placeholder.svg"}
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {car.is_featured && (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground shadow-lg">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Featured
            </Badge>
          )}
          
          {car.category?.name && (
            <Badge variant="outline" className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm text-xs border-border/50">
              {car.category.name}
            </Badge>
          )}

          <div className="absolute top-3 right-3 bg-card/95 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-lg border border-border/30">
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-muted-foreground line-through">AED {originalPrice}</span>
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-extrabold text-secondary">AED {car.daily_price}</span>
              <span className="text-[10px] text-muted-foreground">/day</span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-bold text-lg group-hover:text-secondary transition-colors line-clamp-1">
              {car.title}
            </h3>
            <p className="text-sm text-muted-foreground">{car.brand} • {car.model} • {car.year}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
              <Users className="w-3.5 h-3.5" />
              <span>{car.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
              <Settings2 className="w-3.5 h-3.5" />
              <span>{car.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg">
              <Fuel className="w-3.5 h-3.5" />
              <span>{car.fuel_type}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {car.driver_available && (
              <Badge variant="outline" className="text-xs bg-secondary/5 border-secondary/20 text-secondary">With Driver</Badge>
            )}
            {car.self_drive && (
              <Badge variant="outline" className="text-xs bg-secondary/5 border-secondary/20 text-secondary">Self Drive</Badge>
            )}
          </div>

          {/* Weekly/Monthly pricing strip */}
          {(car.weekly_price || car.monthly_price) && (
            <div className="flex gap-2 pt-1">
              {car.weekly_price && (
                <div className="flex-1 text-center py-1.5 bg-muted/40 rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase">Weekly</p>
                  <p className="text-xs font-bold text-foreground">AED {car.weekly_price}</p>
                </div>
              )}
              {car.monthly_price && (
                <div className="flex-1 text-center py-1.5 bg-muted/40 rounded-lg">
                  <p className="text-[10px] text-muted-foreground uppercase">Monthly</p>
                  <p className="text-xs font-bold text-foreground">AED {car.monthly_price}</p>
                </div>
              )}
            </div>
          )}
          
          <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-semibold group/btn">
            View Details
            <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CarCard;