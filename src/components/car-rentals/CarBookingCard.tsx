import { CarRental } from "@/hooks/useCarRentals";
import { Check, Shield, Clock, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface CarBookingCardProps {
  car: CarRental;
  whatsapp: string;
  onBook: () => void;
}

const CarBookingCard = ({ car, whatsapp, onBook }: CarBookingCardProps) => {
  const pricingTiers = [
    {
      name: "Daily",
      price: car.daily_price,
      period: "day",
      features: ["Minimum 1 day", "Free cancellation", "Basic insurance included"],
    },
    {
      name: "Weekly",
      price: car.weekly_price,
      period: "week",
      features: ["7 days minimum", "10% discount", "Full insurance included"],
      popular: true,
    },
    {
      name: "Monthly",
      price: car.monthly_price,
      period: "month",
      features: ["30 days minimum", "25% discount", "Premium insurance included"],
    },
  ].filter((tier) => tier.price !== null && tier.price !== undefined);

  const trustBadges = [
    { icon: Shield, text: "Insurance included" },
    { icon: Clock, text: "24/7 roadside assistance" },
    { icon: Check, text: "Free cancellation (24h)" },
  ];

  return (
    <Card className="sticky top-24 overflow-hidden shadow-lg border-0">
      <CardContent className="p-0">
        {/* Header - Starting Price */}
        <div className="text-center py-6 px-6 bg-gradient-to-b from-background to-muted/30">
          <p className="text-sm text-muted-foreground mb-1">Starting from</p>
          <div className="text-4xl md:text-5xl font-bold text-secondary">
            AED {car.daily_price?.toLocaleString()}
          </div>
          <p className="text-muted-foreground">per day</p>
        </div>

        {/* Pricing Tiers Comparison Table */}
        <div className="mx-4 mb-4 border rounded-xl overflow-hidden bg-card">
          {/* Pricing Header Row */}
          <div className={cn(
            "grid divide-x border-b",
            pricingTiers.length === 3 ? "grid-cols-3" : pricingTiers.length === 2 ? "grid-cols-2" : "grid-cols-1"
          )}>
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  "relative py-4 px-3 text-center",
                  tier.popular && "bg-secondary/5"
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2">
                    <span className="bg-secondary text-secondary-foreground text-[10px] px-2.5 py-0.5 rounded-b-md font-semibold whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}
                <p className={cn(
                  "text-xs font-medium text-muted-foreground mb-2",
                  tier.popular && "mt-3"
                )}>
                  {tier.name}
                </p>
                <div className="flex flex-col items-center">
                  <span className="text-secondary font-bold text-lg md:text-xl leading-tight">
                    AED
                  </span>
                  <span className="text-secondary font-bold text-xl md:text-2xl">
                    {tier.price?.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground text-xs mt-1">
                    {tier.period}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div className={cn(
            "grid divide-x",
            pricingTiers.length === 3 ? "grid-cols-3" : pricingTiers.length === 2 ? "grid-cols-2" : "grid-cols-1"
          )}>
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  "p-3 space-y-2",
                  tier.popular && "bg-secondary/5"
                )}
              >
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-1.5 text-xs">
                    <Check className="w-3.5 h-3.5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="px-6 py-4 border-t border-b bg-muted/20 space-y-2.5">
          {trustBadges.map((badge, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              <badge.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground">{badge.text}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="p-4 space-y-3">
          <Button
            size="lg"
            className="w-full h-12 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-base rounded-xl"
            onClick={onBook}
          >
            Book This Car
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full h-12 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-semibold text-base rounded-xl transition-colors"
            onClick={() => {
              const message = encodeURIComponent(`Hi! I'm interested in renting the ${car.title}`);
              window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
            }}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            WhatsApp Enquiry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CarBookingCard;
