import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CarRental } from "@/hooks/useCarRentals";
import { useContactConfig } from "@/hooks/useContactConfig";
import { cn } from "@/lib/utils";

interface CarBookingModalProps {
  car: CarRental;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CarBookingModal = ({ car, open, onOpenChange }: CarBookingModalProps) => {
  const { whatsapp } = useContactConfig();
  const [pickupDate, setPickupDate] = useState<Date>();
  const [dropoffDate, setDropoffDate] = useState<Date>();
  const [rentalType, setRentalType] = useState<"self" | "driver">("self");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    pickupLocation: "",
    notes: "",
  });

  const calculateTotal = () => {
    if (!pickupDate || !dropoffDate) return car.daily_price;
    
    const days = Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days >= 30 && car.monthly_price) {
      const months = Math.floor(days / 30);
      const remainingDays = days % 30;
      return months * car.monthly_price + remainingDays * car.daily_price;
    }
    
    if (days >= 7 && car.weekly_price) {
      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;
      return weeks * car.weekly_price + remainingDays * car.daily_price;
    }
    
    return days * car.daily_price;
  };

  const handleWhatsApp = () => {
    const total = calculateTotal();
    const duration = pickupDate && dropoffDate 
      ? Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24))
      : 1;
    
    const message = encodeURIComponent(
      `Hello! I'm interested in renting:\n\n` +
      `🚗 *${car.title}*\n` +
      `📅 Pickup: ${pickupDate ? format(pickupDate, "PPP") : "Not selected"}\n` +
      `📅 Return: ${dropoffDate ? format(dropoffDate, "PPP") : "Not selected"}\n` +
      `⏱️ Duration: ${duration} day(s)\n` +
      `👤 Type: ${rentalType === "driver" ? "With Driver" : "Self Drive"}\n` +
      `💰 Estimated Total: AED ${total}\n\n` +
      `📍 Pickup Location: ${formData.pickupLocation || "To be confirmed"}\n` +
      `📞 Contact: ${formData.phone || "Not provided"}\n` +
      `📧 Email: ${formData.email || "Not provided"}\n` +
      (formData.notes ? `\n📝 Notes: ${formData.notes}` : "")
    );
    
    window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book {car.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          {/* Rental Type */}
          <div className="space-y-2">
            <Label>Rental Type</Label>
            <RadioGroup
              value={rentalType}
              onValueChange={(value) => setRentalType(value as "self" | "driver")}
              className="flex gap-4"
            >
              {car.self_drive && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="self" id="self" />
                  <Label htmlFor="self" className="cursor-pointer">Self Drive</Label>
                </div>
              )}
              {car.driver_available && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="driver" id="driver" />
                  <Label htmlFor="driver" className="cursor-pointer">With Driver</Label>
                </div>
              )}
            </RadioGroup>
          </div>
          
          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Pickup Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !pickupDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {pickupDate ? format(pickupDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={pickupDate}
                    onSelect={setPickupDate}
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>Return Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dropoffDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dropoffDate ? format(dropoffDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dropoffDate}
                    onSelect={setDropoffDate}
                    disabled={(date) => date < (pickupDate || new Date())}
                  />
                </PopoverContent>
              </Popover>
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
            <Label htmlFor="pickup">Pickup Location</Label>
            <Input
              id="pickup"
              value={formData.pickupLocation}
              onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
              placeholder="Hotel name or address"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Special Requests (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special requirements..."
              rows={3}
            />
          </div>
          
          {/* Price Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Daily Rate</span>
              <span>AED {car.daily_price}</span>
            </div>
            {car.weekly_price && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Weekly Rate</span>
                <span>AED {car.weekly_price}</span>
              </div>
            )}
            {car.monthly_price && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Rate</span>
                <span>AED {car.monthly_price}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Estimated Total</span>
              <span className="text-secondary">AED {calculateTotal()}</span>
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
              Book via WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarBookingModal;