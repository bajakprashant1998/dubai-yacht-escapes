import { Link } from "react-router-dom";
import { Clock, Hotel, Car, Ticket, FileText, Users, Heart, Mountain, Crown, Sparkles, Star, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
      <Card className={cn(
        "overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-border/50 hover:border-secondary/30",
        className
      )}>
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={combo.image_url || "/placeholder.svg"}
            alt={combo.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge className="bg-primary/80 text-primary-foreground backdrop-blur-sm border-0 text-[11px]">
              <Clock className="w-3 h-3 mr-1" />
              {combo.duration_days}D / {combo.duration_nights}N
            </Badge>
            {combo.is_featured && (
              <Badge className="bg-secondary/90 text-secondary-foreground backdrop-blur-sm border-0 text-[11px]">
                <Star className="w-3 h-3 mr-1" /> Featured
              </Badge>
            )}
          </div>

          {/* Discount Badge */}
          {combo.discount_percent > 0 && (
            <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground border-0 text-[11px] font-bold">
              Save {combo.discount_percent}%
            </Badge>
          )}

          {/* Type Badge - Bottom */}
          <div className={cn(
            "absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold backdrop-blur-sm",
            typeConfig.color
          )}>
            <TypeIcon className="w-3.5 h-3.5" />
            {typeConfig.label}
          </div>

          {/* Price overlay - Bottom Right */}
          <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-border/50">
            {combo.base_price_aed > combo.final_price_aed && (
              <span className="text-[10px] text-muted-foreground line-through block text-right">
                {formatPrice(combo.base_price_aed)}
              </span>
            )}
            <span className="text-lg font-extrabold text-secondary leading-tight">
              {formatPrice(combo.final_price_aed)}
            </span>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Title */}
          <h3 className="text-lg font-bold text-foreground group-hover:text-secondary transition-colors line-clamp-1 mb-1.5">
            {combo.name}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
            {combo.description}
          </p>

          {/* Inclusions */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex items-center gap-2">
              {inclusions.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground"
                  title={item.label}
                >
                  <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <item.icon className="w-3.5 h-3.5 text-secondary" />
                  </div>
                </div>
              ))}
            </div>
            <span className="text-xs font-semibold text-secondary group-hover:translate-x-1 transition-transform">
              View Details →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ComboCard;
