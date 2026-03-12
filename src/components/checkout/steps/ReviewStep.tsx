import { format } from "date-fns";
import { Clock, Users, CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { BookingItem } from "../CheckoutModal";

interface ReviewStepProps {
  item: BookingItem;
  adults: number;
  children: number;
  totalPrice: number;
  bookingDate: Date | undefined;
  dateCalOpen: boolean;
  setDateCalOpen: (open: boolean) => void;
  setBookingDate: (date: Date | undefined) => void;
}

const ReviewStep = ({ item, adults, children, totalPrice, bookingDate, dateCalOpen, setDateCalOpen, setBookingDate }: ReviewStepProps) => {
  const totalGuests = adults + children;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Review Your Selection</h3>
        <p className="text-sm text-muted-foreground">Confirm the details before proceeding</p>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            {item.image && (
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg shrink-0" />
            )}
            <div className="flex-1">
              <h4 className="font-semibold">{item.name}</h4>
              {item.duration && (
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" /> {item.duration}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  <Users className="w-3 h-3 mr-1" />
                  {adults} Adults{children > 0 && `, ${children} Children`}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <Label>Select Date</Label>
        <Popover open={dateCalOpen} onOpenChange={setDateCalOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !bookingDate && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {bookingDate ? format(bookingDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={bookingDate}
              onSelect={(date) => { setBookingDate(date); setDateCalOpen(false); }}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">AED {item.price.toLocaleString()} × {totalGuests} guests</span>
            <span>AED {totalPrice.toLocaleString()}</span>
          </div>
          {item.discountPercent && item.discountPercent > 0 && (
            <div className="flex justify-between text-sm text-destructive">
              <span>Discount ({item.discountPercent}%)</span>
              <span>-AED {(((item.originalPrice || item.price) - item.price) * totalGuests).toLocaleString()}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-secondary">AED {totalPrice.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
