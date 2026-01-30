import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  CalendarIcon,
  Check,
  CreditCard,
  Clock,
  ShieldCheck,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  MessageSquare,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number is required"),
  specialRequests: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export interface BookingItem {
  id: string;
  type: "combo" | "service" | "tour";
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  duration?: string;
  image?: string;
}

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: BookingItem;
  adults?: number;
  children?: number;
}

const CheckoutModal = ({
  open,
  onOpenChange,
  item,
  adults = 2,
  children = 0,
}: CheckoutModalProps) => {
  const [step, setStep] = useState(1);
  const [bookingDate, setBookingDate] = useState<Date>();
  const [paymentMethod, setPaymentMethod] = useState<"later" | "online">("later");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialRequests: "",
    },
  });

  const totalGuests = adults + children;
  const totalPrice = item.price * totalGuests;

  const handleSubmit = async () => {
    const values = form.getValues();
    const isValid = await form.trigger();

    if (!isValid || !bookingDate) {
      toast({
        title: "Please complete all fields",
        description: "Make sure to fill in your details and select a date",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          tour_id: item.id,
          tour_name: item.name,
          customer_name: values.name,
          customer_email: values.email,
          customer_phone: values.phone,
          booking_date: format(bookingDate, "yyyy-MM-dd"),
          adults,
          children,
          infants: 0,
          total_price: totalPrice,
          special_requests: values.specialRequests || null,
          status: "pending",
          booking_type: item.type,
          booking_source: "website",
        })
        .select()
        .single();

      if (error) throw error;

      setBookingId(data.id);
      setStep(4);
      
      toast({
        title: "Booking Confirmed!",
        description: "Your booking has been submitted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Review Your Selection</h3>
              <p className="text-sm text-muted-foreground">
                Confirm the details before proceeding
              </p>
            </div>

            {/* Item Card */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    {item.duration && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {item.duration}
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

            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !bookingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {bookingDate ? format(bookingDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={bookingDate}
                    onSelect={setBookingDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Price Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    AED {item.price.toLocaleString()} × {totalGuests} guests
                  </span>
                  <span>AED {totalPrice.toLocaleString()}</span>
                </div>
                {item.discountPercent && item.discountPercent > 0 && (
                  <div className="flex justify-between text-sm text-destructive">
                    <span>Discount ({item.discountPercent}%)</span>
                    <span>
                      -AED {(((item.originalPrice || item.price) - item.price) * totalGuests).toLocaleString()}
                    </span>
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

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Your Details</h3>
              <p className="text-sm text-muted-foreground">
                We'll use this information to confirm your booking
              </p>
            </div>

            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" placeholder="John Doe" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" placeholder="john@example.com" type="email" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" placeholder="+971 50 123 4567" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialRequests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Requests (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Textarea
                            className="pl-10 min-h-[80px]"
                            placeholder="Any special requirements or requests..."
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Payment Method</h3>
              <p className="text-sm text-muted-foreground">
                Choose how you'd like to pay
              </p>
            </div>

            <RadioGroup
              value={paymentMethod}
              onValueChange={(v) => setPaymentMethod(v as "later" | "online")}
              className="space-y-4"
            >
              <div
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors",
                  paymentMethod === "later"
                    ? "border-secondary bg-secondary/5"
                    : "border-border hover:border-secondary/50"
                )}
                onClick={() => setPaymentMethod("later")}
              >
                <RadioGroupItem value="later" id="later" />
                <Clock className="h-6 w-6 text-secondary" />
                <div className="flex-1">
                  <Label htmlFor="later" className="font-medium cursor-pointer">
                    Pay Later
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Confirm now, pay at the destination
                  </p>
                </div>
                <Badge variant="secondary">Recommended</Badge>
              </div>

              <div
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors opacity-60",
                  paymentMethod === "online"
                    ? "border-secondary bg-secondary/5"
                    : "border-border"
                )}
              >
                <RadioGroupItem value="online" id="online" disabled />
                <CreditCard className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1">
                  <Label htmlFor="online" className="font-medium cursor-pointer">
                    Pay Online
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Secure online payment
                  </p>
                </div>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </RadioGroup>

            {/* Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Package</span>
                  <span>{item.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span>{bookingDate ? format(bookingDate, "PPP") : "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Guests</span>
                  <span>{adults} Adults{children > 0 && `, ${children} Children`}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-secondary">AED {totalPrice.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" />
                Secure Booking
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-4 w-4" />
                Instant Confirmation
              </span>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center py-6">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-600">Booking Confirmed!</h3>
              <p className="text-muted-foreground mt-1">
                Your booking has been submitted successfully
              </p>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="p-4 space-y-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Booking ID</span>
                  <span className="font-mono">{bookingId?.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Package</span>
                  <span>{item.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Date</span>
                  <span>{bookingDate ? format(bookingDate, "PPP") : "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="text-amber-600 border-amber-300">
                    Payment Pending
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to <strong>{form.getValues("email")}</strong>.
              Our team will contact you shortly with payment details.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after animation completes
    setTimeout(() => {
      setStep(1);
      setBookingDate(undefined);
      setPaymentMethod("later");
      setBookingId(null);
      form.reset();
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Checkout</span>
            {step < 4 && (
              <Badge variant="secondary" className="font-normal">
                Step {step} of 3
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Progress */}
        {step < 4 && (
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  s <= step ? "bg-secondary" : "bg-muted"
                )}
              />
            ))}
          </div>
        )}

        {renderStep()}

        {/* Navigation */}
        {step < 4 && (
          <div className="flex gap-3 pt-4 border-t">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !bookingDate}
                className="flex-1 bg-secondary hover:bg-secondary/90"
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-secondary hover:bg-secondary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Confirm Booking
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {step === 4 && (
          <Button onClick={handleClose} className="w-full">
            Close
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
