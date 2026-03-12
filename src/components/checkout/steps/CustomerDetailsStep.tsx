import { UseFormReturn } from "react-hook-form";
import { User, Mail, Phone, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";

interface CustomerDetailsStepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
}

interface CustomerDetailsStepProps {
  form: UseFormReturn<CustomerFormValues>;
}

const CustomerDetailsStep = ({ form }: CustomerDetailsStepProps) => (
  <div className="space-y-6">
    <div className="text-center">
      <h3 className="text-lg font-semibold">Your Details</h3>
      <p className="text-sm text-muted-foreground">We'll use this information to confirm your booking</p>
    </div>

    <Form {...form}>
      <form className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
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
        )} />

        <FormField control={form.control} name="email" render={({ field }) => (
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
        )} />

        <FormField control={form.control} name="phone" render={({ field }) => (
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
        )} />

        <FormField control={form.control} name="specialRequests" render={({ field }) => (
          <FormItem>
            <FormLabel>Special Requests (Optional)</FormLabel>
            <FormControl>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea className="pl-10 min-h-[80px]" placeholder="Any special requirements or requests..." {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
      </form>
    </Form>
  </div>
);

export default CustomerDetailsStep;
