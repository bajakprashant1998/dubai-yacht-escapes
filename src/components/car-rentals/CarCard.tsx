import { Link } from "react-router-dom";
import { Car, Users, Fuel, Settings2 } from "lucide-react";
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
  
  return (
    <Link to={detailUrl} className="block group">
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 cursor-pointer">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={car.image_url || "/placeholder.svg"}
            alt={car.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {car.is_featured && (
            <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
              Featured
            </Badge>
          )}
          <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-lg">
            <span className="text-lg font-bold text-primary">AED {car.daily_price}</span>
            <span className="text-xs text-muted-foreground">/day</span>
          </div>
        </div>
        
        <CardContent className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg group-hover:text-secondary transition-colors line-clamp-1">
              {car.title}
            </h3>
            <p className="text-sm text-muted-foreground">{car.brand} • {car.year}</p>
          </div>
          
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{car.seats} Seats</span>
            </div>
            <div className="flex items-center gap-1">
              <Settings2 className="w-4 h-4" />
              <span>{car.transmission}</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="w-4 h-4" />
              <span>{car.fuel_type}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {car.driver_available && (
              <Badge variant="outline" className="text-xs">With Driver</Badge>
            )}
            {car.self_drive && (
              <Badge variant="outline" className="text-xs">Self Drive</Badge>
            )}
          </div>
          
          <div className="pt-2 flex gap-2">
            <Button variant="outline" className="flex-1">View Details</Button>
            <Button className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Book Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CarCard;