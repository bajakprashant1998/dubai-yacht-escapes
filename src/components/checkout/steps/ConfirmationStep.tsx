import { format } from "date-fns";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { BookingItem } from "../CheckoutModal";

interface ConfirmationStepProps {
  item: BookingItem;
  bookingDate: Date | undefined;
  email: string;
}

const ConfirmationStep = ({ item, bookingDate, email }: ConfirmationStepProps) => (
  <div className="space-y-6 text-center py-6">
    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
      <Check className="h-8 w-8 text-green-600" />
    </div>
    <div>
      <h3 className="text-xl font-semibold text-green-600">Booking Confirmed!</h3>
      <p className="text-muted-foreground mt-1">Your booking has been submitted successfully</p>
    </div>

    <Card className="bg-muted/50">
      <CardContent className="p-4 space-y-2 text-left">
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
          <Badge variant="outline" className="text-amber-600 border-amber-300">Payment Pending</Badge>
        </div>
      </CardContent>
    </Card>

    <p className="text-sm text-muted-foreground">
      A confirmation email has been sent to <strong>{email}</strong>.
      Our team will contact you shortly with payment details.
    </p>
  </div>
);

export default ConfirmationStep;
