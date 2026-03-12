import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ReviewStep from "./steps/ReviewStep";
import CustomerDetailsStep from "./steps/CustomerDetailsStep";
import PaymentStep from "./steps/PaymentStep";
import ConfirmationStep from "./steps/ConfirmationStep";

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

const CheckoutModal = ({ open, onOpenChange, item, adults = 2, children = 0 }: CheckoutModalProps) => {
  const [step, setStep] = useState(1);
  const [bookingDate, setBookingDate] = useState<Date>();
  const [dateCalOpen, setDateCalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"later" | "online">("later");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: "", email: "", phone: "", specialRequests: "" },
  });

  const totalGuests = adults + children;
  const totalPrice = item.price * totalGuests;

  const handleSubmit = async () => {
    const values = form.getValues();
    const isValid = await form.trigger();

    if (!isValid || !bookingDate) {
      toast({ title: "Please complete all fields", description: "Make sure to fill in your details and select a date", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        tour_id: item.id, tour_name: item.name, customer_name: values.name,
        customer_email: values.email, customer_phone: values.phone,
        booking_date: format(bookingDate, "yyyy-MM-dd"), adults, children, infants: 0,
        total_price: totalPrice, special_requests: values.specialRequests || null,
        status: "pending", booking_type: item.type, booking_source: "website",
      });
      if (error) throw error;
      setStep(4);
      toast({ title: "Booking Confirmed!", description: "Your booking has been submitted successfully." });
    } catch (error: any) {
      toast({ title: "Booking Failed", description: error.message || "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ReviewStep item={item} adults={adults} children={children} totalPrice={totalPrice} bookingDate={bookingDate} dateCalOpen={dateCalOpen} setDateCalOpen={setDateCalOpen} setBookingDate={setBookingDate} />;
      case 2:
        return <CustomerDetailsStep form={form} />;
      case 3:
        return <PaymentStep item={item} adults={adults} children={children} totalPrice={totalPrice} bookingDate={bookingDate} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />;
      case 4:
        return <ConfirmationStep item={item} bookingDate={bookingDate} email={form.getValues("email")} />;
      default:
        return null;
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => { setStep(1); setBookingDate(undefined); setPaymentMethod("later"); form.reset(); }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Checkout</span>
            {step < 4 && <Badge variant="secondary" className="font-normal">Step {step} of 3</Badge>}
          </DialogTitle>
        </DialogHeader>

        {step < 4 && (
          <div className="flex gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className={cn("h-1 flex-1 rounded-full transition-colors", s <= step ? "bg-secondary" : "bg-muted")} />
            ))}
          </div>
        )}

        {renderStep()}

        {step < 4 && (
          <div className="flex gap-3 pt-4 border-t">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={() => setStep(step + 1)} disabled={step === 1 && !bookingDate} className="flex-1 bg-secondary hover:bg-secondary/90">
                Continue <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-secondary hover:bg-secondary/90">
                {isSubmitting ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Confirming...</>) : (<><Check className="h-4 w-4 mr-2" /> Confirm Booking</>)}
              </Button>
            )}
          </div>
        )}

        {step === 4 && <Button onClick={handleClose} className="w-full">Close</Button>}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
