import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MessageCircle, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Hotel } from "@/hooks/useHotels";
import { HotelRoom } from "@/hooks/useHotelRooms";
import { useContactConfig } from "@/hooks/useContactConfig";
import { cn } from "@/lib/utils";

interface HotelEnquiryModalProps {
  hotel: Hotel;
  room?: HotelRoom;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HotelEnquiryModal = ({ hotel, room, open, onOpenChange }: HotelEnquiryModalProps) => {
  const { whatsapp } = useContactConfig();
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState(2);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 1;
    return Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const handleWhatsApp = () => {
    const nights = calculateNights();
    const pricePerNight = room?.price_per_night || hotel.price_from || 0;
    
    const message = encodeURIComponent(
      `Hello! I'm interested in booking:\n\n` +
      `🏨 *${hotel.name}*\n` +
      (room ? `🛏️ Room: ${room.name}\n` : "") +
      `📅 Check-in: ${checkInDate ? format(checkInDate, "PPP") : "Not selected"}\n` +
      `📅 Check-out: ${checkOutDate ? format(checkOutDate, "PPP") : "Not selected"}\n` +
      `🌙 Nights: ${nights}\n` +
      `👥 Guests: ${guests}\n` +
      `💰 Estimated Total: AED ${pricePerNight * nights}\n\n` +
      `📍 Location: ${hotel.location || "Dubai"}\n` +
      `📞 Contact: ${formData.phone || "Not provided"}\n` +
      `📧 Email: ${formData.email || "Not provided"}\n` +
      (formData.notes ? `\n📝 Special Requests: ${formData.notes}` : "")
    );
    
    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {room ? `Book ${room.name}` : `Enquire about ${hotel.name}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Check-in Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOutDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    disabled={(date) => date <= (checkInDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          {/* Guests */}
          <div className="space-y-2">
            <Label>Number of Guests</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setGuests(Math.max(1, guests - 1))}
              >
                -
              </Button>
              <span className="w-12 text-center font-medium">{guests}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setGuests(Math.min(room?.max_guests || 10, guests + 1))}
              >
                +
              </Button>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your name"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+971..."
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Special Requests (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Early check-in, late check-out, dietary requirements..."
              rows={3}
            />
          </div>
          
          {/* Price Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {room ? room.name : "Starting price"}
              </span>
              <span>AED {room?.price_per_night || hotel.price_from}/night</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nights</span>
              <span>{calculateNights()}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Estimated Total</span>
              <span className="text-secondary">
                AED {(room?.price_per_night || hotel.price_from || 0) * calculateNights()}
              </span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-[#25D366] hover:bg-[#22c55e] text-white"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Enquire via WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotelEnquiryModal;