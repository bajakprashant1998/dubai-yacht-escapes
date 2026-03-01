import { Users, Bed, Maximize, Check, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HotelRoom } from "@/hooks/useHotelRooms";

interface HotelRoomCardProps {
  room: HotelRoom;
  onBook: (room: HotelRoom) => void;
}

const HotelRoomCard = ({ room, onBook }: HotelRoomCardProps) => {
  const fakeOriginalPrice = Math.round(room.price_per_night * 1.18);

  return (
    <Card className="overflow-hidden rounded-xl border-border/50 hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 aspect-[4/3] md:aspect-auto relative overflow-hidden">
          <img
            src={room.image_url || "/placeholder.svg"}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-gradient-to-r" />
          {room.is_available === false && (
            <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground rounded-lg text-xs">
              Sold Out
            </Badge>
          )}
        </div>

        <CardContent className="flex-1 p-5 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg group-hover:text-secondary transition-colors">{room.name}</h3>

            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {room.max_guests && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg">
                  <Users className="w-3.5 h-3.5 text-secondary" />
                  <span>{room.max_guests} Guests</span>
                </div>
              )}
              {room.beds && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg">
                  <Bed className="w-3.5 h-3.5 text-secondary" />
                  <span>{room.beds}</span>
                </div>
              )}
              {room.size_sqm && (
                <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg">
                  <Maximize className="w-3.5 h-3.5 text-secondary" />
                  <span>{room.size_sqm} sqm</span>
                </div>
              )}
            </div>

            {room.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>
            )}

            {room.amenities && room.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {room.amenities.slice(0, 5).map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs font-normal gap-1 rounded-lg">
                    <Check className="w-3 h-3 text-secondary" />
                    {amenity}
                  </Badge>
                ))}
                {room.amenities.length > 5 && (
                  <Badge variant="outline" className="text-xs font-normal rounded-lg">
                    +{room.amenities.length - 5}
                  </Badge>
                )}
              </div>
            )}
          </div>

          <div className="flex items-end justify-between mt-4 pt-4 border-t border-border/50">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs text-muted-foreground line-through">AED {fakeOriginalPrice.toLocaleString()}</span>
                <span className="text-2xl font-bold text-secondary">
                  AED {room.price_per_night.toLocaleString()}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">per night</span>
            </div>
            <Button
              onClick={() => onBook(room)}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl gap-1.5 group/btn"
              disabled={room.is_available === false}
            >
              {room.is_available === false ? "Unavailable" : "Book Room"}
              {room.is_available !== false && (
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
              )}
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default HotelRoomCard;
