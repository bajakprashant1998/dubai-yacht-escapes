import { Users, Bed, Maximize, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HotelRoom } from "@/hooks/useHotelRooms";

interface HotelRoomCardProps {
  room: HotelRoom;
  onBook: (room: HotelRoom) => void;
}

const HotelRoomCard = ({ room, onBook }: HotelRoomCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 aspect-[4/3] md:aspect-auto">
          <img
            src={room.image_url || "/placeholder.svg"}
            alt={room.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <CardContent className="flex-1 p-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">{room.name}</h3>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{room.max_guests} Guests</span>
              </div>
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{room.beds}</span>
              </div>
              {room.size_sqm && (
                <div className="flex items-center gap-1">
                  <Maximize className="w-4 h-4" />
                  <span>{room.size_sqm} sqm</span>
                </div>
              )}
            </div>
            
            {room.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {room.description}
              </p>
            )}
            
            {room.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {room.amenities.slice(0, 5).map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    {amenity}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div>
              <span className="text-2xl font-bold text-secondary">
                AED {room.price_per_night}
              </span>
              <span className="text-sm text-muted-foreground ml-1">/night</span>
            </div>
            <Button
              onClick={() => onBook(room)}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              Book This Room
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default HotelRoomCard;