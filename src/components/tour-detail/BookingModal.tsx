import { useState, useEffect } from "react";
import { format } from "date-fns";
import { 
  ArrowRight, 
  ArrowLeft, 
  Minus, 
  Plus, 
  CalendarIcon, 
  Check, 
  Loader2,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { sendBookingEmail } from "@/lib/sendBookingEmail";
import DiscountCodeInput from "@/components/booking/DiscountCodeInput";
import { Discount } from "@/hooks/useDiscounts";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourTitle: string;
  tourId: string;
  price: number;
}

const steps = [
  { number: 1, label: "Select Tour" },
  { number: 2, label: "Your Details" },
  { number: 3, label: "Confirm" },
];

const BookingModal = ({ isOpen, onClose, tourTitle, tourId, price }: BookingModalProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Step 1 state
  const [date, setDate] = useState<Date>();
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Step 2 state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Discount state
  const [appliedDiscount, setAppliedDiscount] = useState<Discount | null>(null);

  const subtotal = price * adults + price * 0.5 * children;
  
  const calculateDiscountAmount = () => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.type === "percentage") {
      return (subtotal * appliedDiscount.value) / 100;
    }
    return Math.min(appliedDiscount.value, subtotal);
  };

  const discountAmount = calculateDiscountAmount();
  const totalPrice = subtotal - discountAmount;

  // Handle step animation
  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setCurrentStep(1);
        setDate(undefined);
        setAdults(2);
        setChildren(0);
        setInfants(0);
        setName("");
        setEmail("");
        setPhone("");
        setSpecialRequests("");
        setAppliedDiscount(null);
        setSubmitError(null);
      }, 300);
    }
  }, [isOpen]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setIsCalendarOpen(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!date) {
        toast({ title: "Please select a date", variant: "destructive" });
        return;
      }
    }
    if (currentStep === 2) {
      if (!name.trim()) {
        toast({ title: "Please enter your name", variant: "destructive" });
        return;
      }
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast({ title: "Please enter a valid email", variant: "destructive" });
        return;
      }
      if (!phone.trim() || phone.length < 8) {
        toast({ title: "Please enter a valid phone number", variant: "destructive" });
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const { data: bookingData, error } = await supabase.from("bookings").insert({
        tour_id: tourId,
        tour_name: tourTitle,
        booking_date: format(date!, "yyyy-MM-dd"),
        adults,
        children,
        infants,
        customer_name: name.trim(),
        customer_email: email.trim(),
        customer_phone: phone.trim(),
        special_requests: specialRequests.trim() || null,
        total_price: totalPrice,
        status: "pending",
      }).select().single();

      if (error) {
        console.error("Booking error:", error);
        if (error.code === "42501") {
          throw new Error("Unable to create booking. Please try again or contact support.");
        }
        throw new Error(error.message);
      }

      // Send confirmation email (don't block on failure)
      if (bookingData?.id) {
        sendBookingEmail(bookingData.id, "pending")
          .then(result => {
            if (!result.success) {
              console.warn("Email notification failed, but booking was created");
            }
          })
          .catch(console.warn);
      }

      toast({ 
        title: "🎉 Booking submitted!", 
        description: "Check your email for confirmation. We'll contact you shortly." 
      });
      onClose();
    } catch (error: any) {
      console.error("Booking submission error:", error);
      setSubmitError(error.message || "Something went wrong. Please try again.");
      toast({ 
        title: "Booking failed", 
        description: error.message || "Please try again or contact support.", 
        variant: "destructive" 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const GuestCounter = ({ 
    label, 
    sublabel, 
    value, 
    onChange, 
    min = 0, 
    max = 10 
  }: { 
    label: string; 
    sublabel: string; 
    value: number; 
    onChange: (v: number) => void; 
    min?: number; 
    max?: number; 
  }) => (
    <div className="flex-1 min-w-0 border border-border rounded-xl p-3 sm:p-4 transition-all duration-200 hover:border-secondary/50 hover:shadow-sm">
      <div className="flex items-center justify-between sm:block">
        <div className="sm:mb-3">
          <p className="font-semibold text-foreground text-sm sm:text-base">{label}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">{sublabel}</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-0 sm:justify-between">
          <button
            onClick={() => onChange(Math.max(min, value - 1))}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted hover:border-secondary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-target"
            disabled={value <= min}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-lg sm:text-xl font-bold tabular-nums w-8 text-center">{value}</span>
          <button
            onClick={() => onChange(Math.min(max, value + 1))}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-border flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all touch-target"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] md:max-w-[600px] p-0 gap-0 max-h-[calc(100vh-2rem)] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto rounded-xl sm:rounded-2xl">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="sr-only">Book Your Experience</DialogTitle>
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm border-2 transition-all duration-300",
                      currentStep >= step.number
                        ? "bg-secondary text-secondary-foreground border-secondary scale-110"
                        : "bg-muted text-muted-foreground border-border"
                    )}
                  >
                    {currentStep > step.number ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : step.number}
                  </div>
                  <span className={cn(
                    "text-[10px] sm:text-xs mt-1 transition-colors hidden sm:block",
                    currentStep >= step.number ? "text-secondary font-medium" : "text-muted-foreground"
                  )}>{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-8 sm:w-16 md:w-24 h-0.5 mx-1 sm:mx-2 bg-border overflow-hidden">
                    <div 
                      className={cn(
                        "h-full bg-secondary transition-all duration-500",
                        currentStep > step.number ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div className="p-4 sm:p-6 pt-2 sm:pt-4">
          <div className={cn(
            "transition-all duration-300",
            isAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
          )}>
            {/* Step 1: Select Tour */}
            {currentStep === 1 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Choose Your Experience</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">Select your preferred cruise and date</p>
                </div>

                {/* Tour Selection */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Select Tour *</label>
                  <Select defaultValue={tourTitle}>
                    <SelectTrigger className="h-11 sm:h-12">
                      <SelectValue placeholder="Choose your cruise experience" />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50">
                      <SelectItem value={tourTitle}>{tourTitle}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-2 block">Preferred Date *</label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-11 sm:h-12 transition-all text-sm sm:text-base",
                          !date && "text-muted-foreground",
                          date && "border-secondary/50"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{date ? format(date, "EEE, MMM d, yyyy") : "Select a date"}</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50 bg-card" align="center" side="bottom">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        disabled={(d) => d < new Date()}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Guest Counters - Stack on mobile */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">Number of Guests *</label>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <GuestCounter
                      label="Adults"
                      sublabel="12+ years"
                      value={adults}
                      onChange={setAdults}
                      min={1}
                    />
                    <GuestCounter
                      label="Children"
                      sublabel="4-11 yrs • 50% off"
                      value={children}
                      onChange={setChildren}
                    />
                    <GuestCounter
                      label="Infants"
                      sublabel="0-3 yrs • Free"
                      value={infants}
                      onChange={setInfants}
                    />
                  </div>
                </div>

                {/* Quick Price Preview */}
                <div className="bg-muted/50 rounded-xl p-3 sm:p-4 flex items-center justify-between">
                  <span className="text-sm sm:text-base text-muted-foreground">Estimated Total</span>
                  <span className="text-lg sm:text-xl font-bold text-foreground">AED {subtotal.toFixed(0)}</span>
                </div>
              </div>
            )}

            {/* Step 2: Your Details */}
            {currentStep === 2 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Your Details</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">Enter your contact information</p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Full Name *</label>
                    <Input
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-11 sm:h-12"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Email *</label>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 sm:h-12"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Phone Number *</label>
                    <Input
                      type="tel"
                      placeholder="+971 50 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-11 sm:h-12"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 block">Special Requests</label>
                    <Textarea
                      placeholder="Any dietary requirements, celebrations, or special needs..."
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      rows={2}
                      className="min-h-[60px] sm:min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Discount Code */}
                <div className="pt-1 sm:pt-2">
                  <DiscountCodeInput
                    orderAmount={subtotal}
                    tourId={tourId}
                    onDiscountApplied={setAppliedDiscount}
                    appliedDiscount={appliedDiscount}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {currentStep === 3 && (
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">Confirm Booking</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">Review your booking details</p>
                </div>

                <div className="bg-muted/50 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base line-clamp-2">{tourTitle}</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium">{date ? format(date, "EEE, MMM d") : "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Guests</p>
                      <p className="font-medium">
                        {adults} Adult{adults > 1 ? "s" : ""}
                        {children > 0 && `, ${children} Child`}
                        {infants > 0 && `, ${infants} Infant`}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Name</p>
                      <p className="font-medium truncate">{name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium truncate text-xs">{email}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{phone}</p>
                    </div>
                  </div>
                  {specialRequests && (
                    <div className="pt-2 border-t border-border">
                      <p className="text-muted-foreground text-xs">Special Requests</p>
                      <p className="text-xs sm:text-sm line-clamp-2">{specialRequests}</p>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="bg-secondary/10 rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">
                      {adults} adult{adults > 1 ? "s" : ""} × AED {price}
                    </span>
                    <span>AED {(price * adults).toFixed(0)}</span>
                  </div>
                  {children > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">
                        {children} child{children > 1 ? "ren" : ""} × AED {(price * 0.5).toFixed(0)}
                      </span>
                      <span>AED {(price * 0.5 * children).toFixed(0)}</span>
                    </div>
                  )}
                  {appliedDiscount && discountAmount > 0 && (
                    <div className="flex justify-between text-xs sm:text-sm text-secondary font-medium">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Discount ({appliedDiscount.code})
                      </span>
                      <span>- AED {discountAmount.toFixed(0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="font-semibold text-sm sm:text-base">Total</span>
                    <div className="text-right">
                      {discountAmount > 0 && (
                        <p className="text-xs sm:text-sm text-muted-foreground line-through">AED {subtotal.toFixed(0)}</p>
                      )}
                      <span className="text-xl sm:text-2xl font-bold text-foreground">AED {totalPrice.toFixed(0)}</span>
                    </div>
                  </div>
                </div>

                {/* Error display */}
                {submitError && (
                  <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-xs sm:text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Unable to complete booking</p>
                      <p className="text-destructive/80">{submitError}</p>
                    </div>
                  </div>
                )}

                <p className="text-[10px] sm:text-xs text-muted-foreground text-center">
                  By confirming, you agree to our terms and conditions. Free cancellation up to 24 hours before the tour.
                </p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-2 sm:gap-3 mt-6 sm:mt-8 pb-safe">
            {currentStep > 1 && (
              <Button 
                variant="outline" 
                onClick={handleBack} 
                disabled={isSubmitting}
                className="flex-1 h-11 sm:h-12 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-1 sm:mr-2" />
                Back
              </Button>
            )}
            {currentStep < 3 ? (
              <Button 
                onClick={handleNext} 
                className="flex-1 h-11 sm:h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Continue to {currentStep === 1 ? "Details" : "Confirm"}</span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="w-4 h-4 ml-1 sm:ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="flex-1 h-11 sm:h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 text-sm sm:text-base"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1 sm:mr-2 animate-spin" />
                    <span className="hidden sm:inline">Submitting...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Confirm Booking</span>
                    <span className="sm:hidden">Confirm</span>
                    <Check className="w-4 h-4 ml-1 sm:ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
