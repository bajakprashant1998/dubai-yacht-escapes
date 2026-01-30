import { CarRental } from "@/hooks/useCarRentals";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarPricingTableProps {
  car: CarRental;
}

const CarPricingTable = ({ car }: CarPricingTableProps) => {
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

  return (
    <div className="border rounded-xl overflow-hidden bg-card">
      {/* Pricing Tiers Header Row */}
      <div className="grid grid-cols-3 divide-x border-b">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "relative p-4 text-center",
              tier.popular && "bg-secondary/5"
            )}
          >
            {tier.popular && (
              <div className="absolute -top-0 left-1/2 -translate-x-1/2 translate-y-0">
                <span className="bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 rounded-b-md font-medium whitespace-nowrap">
                  Most Popular
                </span>
              </div>
            )}
            <p className={cn(
              "text-sm font-medium text-muted-foreground mb-2",
              tier.popular && "mt-3"
            )}>
              {tier.name}
            </p>
            <div className="flex flex-col items-center">
              <span className="text-secondary font-bold text-xl md:text-2xl">
                AED {tier.price?.toLocaleString()}
              </span>
              <span className="text-muted-foreground text-xs">
                {tier.period}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Features Comparison */}
      <div className="grid grid-cols-3 divide-x">
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
                <Check className="w-3 h-3 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground leading-tight">{feature}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarPricingTable;
