import { Link } from "react-router-dom";
import { Clock, Hotel, Car, Ticket, FileText, Users, Heart, Mountain, Crown, Sparkles, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ComboPackage } from "@/hooks/useComboPackages";
import { useCurrency } from "@/hooks/useCurrency";

interface ComboCardProps {
  combo: ComboPackage;
  className?: string;
}

const comboTypeConfig: Record<string, { icon: LucideIcon; color: string; label: string }> = {
  essentials: { icon: Sparkles, color: "bg-secondary", label: "Essentials" },
  family: { icon: Users, color: "bg-green-500", label: "Family" },
  couple: { icon: Heart, color: "bg-pink-500", label: "Romantic" },
  adventure: { icon: Mountain, color: "bg-orange-500", label: "Adventure" },
  luxury: { icon: Crown, color: "bg-amber-500", label: "Luxury" },
};

const ComboCard = ({ combo, className }: ComboCardProps) => {
  const { formatPrice } = useCurrency();
  const typeConfig = comboTypeConfig[combo.combo_type] || comboTypeConfig.essentials;
  const TypeIcon = typeConfig.icon;

  const inclusions = [
    { included: combo.includes_hotel, icon: Hotel, label: "Hotel" },
    { included: combo.includes_transport, icon: Car, label: "Transport" },
    { included: true, icon: Ticket, label: "Activities" },
    { included: combo.includes_visa, icon: FileText, label: "Visa" },
  ].filter((item) => item.included);

  return (
    <Link to={`/combo-packages/${combo.slug}`} className="block group">
      <Card className={cn("overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer", className)}>
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={combo.image_url || "/placeholder.svg"}
            alt={combo.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Duration Badge */}
          <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
            <Clock className="w-3 h-3 mr-1" />
            {combo.duration_days} Days / {combo.duration_nights} Nights
          </Badge>

          {/* Discount Badge */}
          {combo.discount_percent > 0 && (
            <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
              Save {combo.discount_percent}%
            </Badge>
          )}

          {/* Type Badge */}
          <div className={cn("absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full", typeConfig.color, "text-white text-sm font-medium")}>
            <TypeIcon className="w-4 h-4" />
            {typeConfig.label}
          </div>
        </div>

        <CardContent className="p-5">
          {/* Title */}
          <h3 className="text-xl font-bold text-foreground group-hover:text-secondary transition-colors line-clamp-1 mb-2">
            {combo.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {combo.description}
          </p>

          {/* Inclusions */}
          <div className="flex items-center gap-3 mb-4">
            {inclusions.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-muted"
                title={item.label}
              >
                <item.icon className="w-4 h-4 text-secondary" />
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="flex items-end justify-between pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Starting from</p>
              <div className="flex items-baseline gap-2">
                {combo.base_price_aed > combo.final_price_aed && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(combo.base_price_aed)}
                  </span>
                )}
                <span className="text-2xl font-bold text-foreground">
                  {formatPrice(combo.final_price_aed)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">per person</p>
            </div>

            <Button variant="default" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ComboCard;
