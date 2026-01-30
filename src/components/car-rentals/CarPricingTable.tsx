import { CarRental } from "@/hooks/useCarRentals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface CarPricingTableProps {
  car: CarRental;
}

const CarPricingTable = ({ car }: CarPricingTableProps) => {
  const pricingTiers = [
    {
      name: "Daily",
      price: car.daily_price,
      period: "per day",
      features: ["Minimum 1 day", "Free cancellation", "Basic insurance included"],
    },
    {
      name: "Weekly",
      price: car.weekly_price,
      period: "per week",
      features: ["7 days minimum", "10% discount", "Full insurance included"],
      popular: true,
    },
    {
      name: "Monthly",
      price: car.monthly_price,
      period: "per month",
      features: ["30 days minimum", "25% discount", "Premium insurance included"],
    },
  ].filter((tier) => tier.price !== null && tier.price !== undefined);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {pricingTiers.map((tier) => (
        <Card
          key={tier.name}
          className={`relative ${tier.popular ? "border-secondary shadow-lg" : ""}`}
        >
          {tier.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-secondary text-secondary-foreground text-xs px-3 py-1 rounded-full font-medium">
                Most Popular
              </span>
            </div>
          )}
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">{tier.name}</CardTitle>
            <div className="mt-2">
              <span className="text-3xl font-bold text-secondary">
                AED {tier.price}
              </span>
              <span className="text-muted-foreground text-sm ml-1">
                {tier.period}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CarPricingTable;