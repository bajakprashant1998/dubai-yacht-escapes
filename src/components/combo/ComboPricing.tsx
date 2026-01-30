import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ComboPackage } from "@/hooks/useComboPackages";

interface ComboPricingProps {
  combo: ComboPackage;
}

const ComboPricing = ({ combo }: ComboPricingProps) => {
  const inclusions = [
    { included: combo.includes_hotel, label: `${combo.hotel_star_rating || 4}-Star Hotel Accommodation` },
    { included: combo.includes_transport, label: `Private ${combo.transport_type || "Sedan"} Transport` },
    { included: true, label: "All Activities & Entrance Fees" },
    { included: combo.includes_visa, label: "UAE Tourist Visa" },
    { included: true, label: "24/7 Support & Assistance" },
    { included: true, label: "Airport Pickup & Drop" },
  ];

  const savings = combo.base_price_aed - combo.final_price_aed;

  return (
    <Card className="border-secondary/30">
      <CardHeader className="bg-secondary/5 border-b border-border">
        <CardTitle className="text-xl">Pricing Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Price Display */}
        <div className="text-center pb-6 border-b border-border">
          <p className="text-sm text-muted-foreground mb-1">Package Price</p>
          {combo.discount_percent > 0 && (
            <p className="text-lg text-muted-foreground line-through">
              AED {combo.base_price_aed.toLocaleString()}
            </p>
          )}
          <p className="text-4xl font-bold text-foreground">
            AED {combo.final_price_aed.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">per person</p>
          {savings > 0 && (
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              You save AED {savings.toLocaleString()} ({combo.discount_percent}%)
            </div>
          )}
        </div>

        {/* Group Pricing */}
        <div className="grid grid-cols-2 gap-4 pb-6 border-b border-border">
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground mb-1">2 Travelers</p>
            <p className="text-xl font-bold text-foreground">
              AED {(combo.final_price_aed * 2).toLocaleString()}
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-sm text-muted-foreground mb-1">4 Travelers</p>
            <p className="text-xl font-bold text-foreground">
              AED {(combo.final_price_aed * 4).toLocaleString()}
            </p>
          </div>
        </div>

        {/* What's Included */}
        <div>
          <h4 className="font-semibold text-foreground mb-4">What's Included</h4>
          <ul className="space-y-3">
            {inclusions.map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                {item.included ? (
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                    <X className="w-3 h-3 text-red-600" />
                  </div>
                )}
                <span className={item.included ? "text-foreground" : "text-muted-foreground line-through"}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComboPricing;
