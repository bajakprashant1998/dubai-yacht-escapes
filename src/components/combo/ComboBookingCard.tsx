import { useState } from "react";
import { Phone, MessageCircle, Sparkles, Shield, Clock, CheckCircle, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useContactConfig } from "@/hooks/useContactConfig";
import CheckoutModal from "@/components/checkout/CheckoutModal";
import type { ComboPackage } from "@/hooks/useComboPackages";

interface ComboBookingCardProps {
  combo: ComboPackage;
}

const ComboBookingCard = ({ combo }: ComboBookingCardProps) => {
  const { phone, whatsappLink } = useContactConfig();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in the "${combo.name}" combo package (${combo.duration_days} Days / ${combo.duration_nights} Nights) for AED ${combo.final_price_aed.toLocaleString()} per person. Please share more details.`
  );

  return (
    <>
      <Card className="sticky top-24 border-secondary/30 shadow-lg">
        <CardContent className="p-6 space-y-6">
          {/* Price */}
          <div className="text-center pb-4 border-b border-border">
            <p className="text-sm text-muted-foreground">Starting from</p>
            {combo.discount_percent > 0 && (
              <p className="text-lg text-muted-foreground line-through">
                AED {combo.base_price_aed.toLocaleString()}
              </p>
            )}
            <p className="text-3xl font-bold text-foreground">
              AED {combo.final_price_aed.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">per person</p>
            {combo.discount_percent > 0 && (
              <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium">
                Save {combo.discount_percent}%
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2"
              size="lg"
              onClick={() => setIsCheckoutOpen(true)}
            >
              <CreditCard className="w-5 h-5" />
              Book Now
            </Button>

            <a href={`${whatsappLink}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="block">
              <Button variant="outline" className="w-full border-secondary text-secondary hover:bg-secondary/10 gap-2" size="lg">
                <MessageCircle className="w-5 h-5" />
                WhatsApp Inquiry
              </Button>
            </a>

            <a href={`tel:${phone}`} className="block">
              <Button variant="ghost" className="w-full gap-2" size="lg">
                <Phone className="w-5 h-5" />
                Call to Book
              </Button>
            </a>

            <Link to={`/plan-trip?combo=${combo.slug}`} className="block">
              <Button variant="secondary" className="w-full gap-2" size="lg">
                <Sparkles className="w-5 h-5" />
                Customize This Combo
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-4 border-t border-border space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Shield className="w-5 h-5 text-secondary" />
              <span className="text-muted-foreground">Best Price Guarantee</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <span className="text-muted-foreground">Instant Confirmation</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-5 h-5 text-secondary" />
              <span className="text-muted-foreground">Free Cancellation (24h)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Modal */}
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
