import { format } from "date-fns";
import { Clock, CreditCard, ShieldCheck, Check, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import type { BookingItem } from "../CheckoutModal";

interface PaymentStepProps {
  item: BookingItem;
  adults: number;
  children: number;
  totalPrice: number;
  bookingDate: Date | undefined;
  paymentMethod: "later" | "online";
  setPaymentMethod: (method: "later" | "online") => void;
}

const PaymentStep = ({ item, adults, children, totalPrice, bookingDate, paymentMethod, setPaymentMethod }: PaymentStepProps) => (
  <div className="space-y-6">
    <div className="text-center">
      <h3 className="text-lg font-semibold">Payment Method</h3>
      <p className="text-sm text-muted-foreground">Choose how you'd like to pay</p>
    </div>

    <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as "later" | "online")} className="space-y-4">
      <div
        className={cn(
          "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors",
          paymentMethod === "later" ? "border-secondary bg-secondary/5" : "border-border hover:border-secondary/50"
        )}
        onClick={() => setPaymentMethod("later")}
      >
        <RadioGroupItem value="later" id="later" />
        <Clock className="h-6 w-6 text-secondary" />
        <div className="flex-1">
          <Label htmlFor="later" className="font-medium cursor-pointer">Pay Later</Label>
          <p className="text-sm text-muted-foreground">Confirm now, pay at the destination</p>
        </div>
        <Badge variant="secondary">Recommended</Badge>
      </div>

      <div className={cn("flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors opacity-60", paymentMethod === "online" ? "border-secondary bg-secondary/5" : "border-border")}>
        <RadioGroupItem value="online" id="online" disabled />
        <CreditCard className="h-6 w-6 text-muted-foreground" />
        <div className="flex-1">
          <Label htmlFor="online" className="font-medium cursor-pointer">Pay Online</Label>
          <p className="text-sm text-muted-foreground">Secure online payment</p>
        </div>
        <Badge variant="outline">Coming Soon</Badge>
      </div>
    </RadioGroup>

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

    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
      <span className="flex items-center gap-1"><ShieldCheck className="h-4 w-4" /> Secure Booking</span>
      <span className="flex items-center gap-1"><Check className="h-4 w-4" /> Instant Confirmation</span>
    </div>
  </div>
);

export default PaymentStep;
