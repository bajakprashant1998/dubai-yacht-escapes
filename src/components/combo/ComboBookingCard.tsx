import { useState } from "react";
import { Phone, MessageCircle, Sparkles, Shield, Clock, CheckCircle, CreditCard, Users, Flame, Hotel, Car, Ticket, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useContactConfig } from "@/hooks/useContactConfig";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import type { ComboPackage } from "@/hooks/useComboPackages";

interface ComboBookingCardProps {
  combo: ComboPackage;
}

const ComboBookingCard = ({ combo }: ComboBookingCardProps) => {
  const { phone, whatsappLink } = useContactConfig();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const savings = combo.base_price_aed - combo.final_price_aed;

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in the "${combo.name}" combo package (${combo.duration_days} Days / ${combo.duration_nights} Nights) for AED ${combo.final_price_aed.toLocaleString()} per person. Please share more details.`
  );

  const inclusions = [
    { included: combo.includes_hotel, icon: Hotel, label: `${combo.hotel_star_rating || 4}★ Hotel` },
    { included: combo.includes_transport, icon: Car, label: "Transport" },
    { included: true, icon: Ticket, label: "Activities" },
    { included: combo.includes_visa, icon: FileText, label: "Visa" },
  ].filter((item) => item.included);

  return (
    <>
      <Card className="sticky top-24 overflow-hidden shadow-xl border-0 ring-1 ring-border/50">
        <CardContent className="p-0">
          {/* Urgency Banner */}
          <div className="bg-destructive/10 px-4 py-2.5 flex items-center justify-center gap-2">
            <Flame className="w-4 h-4 text-destructive animate-pulse" />
            <span className="text-xs font-semibold text-destructive">High demand — 12 booked today</span>
          </div>

          {/* Price Section */}
          <div className="text-center pt-6 pb-5 px-6 bg-gradient-to-b from-background to-muted/20">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Starting from</p>
            {combo.discount_percent > 0 && (
              <p className="text-base text-muted-foreground line-through">
                AED {combo.base_price_aed.toLocaleString()}
              </p>
            )}
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-4xl font-extrabold text-foreground">
                AED {combo.final_price_aed.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">per person</p>
            {savings > 0 && (
              <Badge className="mt-3 bg-green-500/10 text-green-600 border-green-500/20 text-xs font-semibold">
                You save AED {savings.toLocaleString()} ({combo.discount_percent}%)
              </Badge>
            )}
          </div>

          {/* Inclusions Mini Strip */}
          <div className="px-5 py-3 border-t border-b border-border/50 bg-muted/30">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 text-center">Includes</p>
            <div className="flex items-center justify-center gap-3">
              {inclusions.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground" title={item.label}>
                  <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <item.icon className="w-3.5 h-3.5 text-secondary" />
                  </div>
                  <span className="hidden sm:inline text-[11px] font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Group Pricing */}
          <div className="px-5 py-4 border-b border-border/50">
            <div className="grid grid-cols-2 gap-2">
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">2 Travelers</span>
                </div>
                <p className="text-sm font-bold">AED {(combo.final_price_aed * 2).toLocaleString()}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">4 Travelers</span>
                </div>
                <p className="text-sm font-bold">AED {(combo.final_price_aed * 4).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="p-5 space-y-2.5">
            <Button
              data-combo-book
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2 rounded-xl h-12 font-bold text-base shadow-lg shadow-secondary/20"
              size="lg"
              onClick={() => setIsCheckoutOpen(true)}
            >
              <CreditCard className="w-5 h-5" />
              Book Now
            </Button>

            <a href={`${whatsappLink}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white gap-2 rounded-xl h-11 font-semibold transition-colors" size="lg">
                <MessageCircle className="w-4 h-4" />
                WhatsApp Inquiry
              </Button>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <a href={`tel:${phone}`} className="block">
                <Button variant="ghost" className="w-full gap-1.5 rounded-xl text-xs h-9 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  Call Us
                </Button>
              </a>
              <Link to={`/trip-planner?combo=${combo.slug}`} className="block">
                <Button variant="ghost" className="w-full gap-1.5 rounded-xl text-xs h-9 text-secondary">
                  <Sparkles className="w-3.5 h-3.5" />
                  Customize
                </Button>
              </Link>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="px-5 pb-5 pt-2 space-y-2">
            {[
              { icon: Shield, text: "Best Price Guarantee" },
              { icon: CheckCircle, text: "Instant Confirmation" },
              { icon: Clock, text: "Free Cancellation (24h)" },
            ].map((badge, index) => (
              <div key={index} className="flex items-center gap-2.5 text-xs">
                <badge.icon className="w-4 h-4 text-secondary flex-shrink-0" />
                <span className="text-muted-foreground">{badge.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <CheckoutModal
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        item={{
          id: combo.id,
          type: "combo",
          name: combo.name,
          price: combo.final_price_aed,
          originalPrice: combo.base_price_aed,
          discountPercent: combo.discount_percent,
          duration: `${combo.duration_days} Days / ${combo.duration_nights} Nights`,
          image: combo.image_url || undefined,
        }}
      />
    </>
  );
};

export default ComboBookingCard;
