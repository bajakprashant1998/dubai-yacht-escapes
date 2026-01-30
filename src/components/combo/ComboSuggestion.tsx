import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { ComboPackage } from "@/hooks/useComboPackages";

interface ComboSuggestionProps {
  combo: ComboPackage;
  onDismiss?: () => void;
}

const ComboSuggestion = ({ combo, onDismiss }: ComboSuggestionProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  return (
    <div className="relative bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent border border-secondary/20 rounded-xl p-4 md:p-6">
      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
        aria-label="Dismiss suggestion"
      >
        <X className="w-4 h-4 text-muted-foreground" />
      </button>

      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-secondary" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary mb-1">
            ✨ Most travelers with your plan choose this combo
          </p>
          <h3 className="text-lg font-bold text-foreground">
            {combo.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {combo.duration_days} Days • Save {combo.discount_percent}% • AED {combo.final_price_aed.toLocaleString()}/person
          </p>
        </div>

        {/* CTA */}
        <Link to={`/combo-packages/${combo.slug}`} className="shrink-0">
          <Button variant="default" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
            View Package
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ComboSuggestion;
