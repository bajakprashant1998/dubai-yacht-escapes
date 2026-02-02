import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, FileText, Zap, Check, ArrowRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VisaService } from "@/hooks/useVisaServices";
import { cn } from "@/lib/utils";

interface VisaCardPremiumProps {
  visa: VisaService;
  isPopular?: boolean;
  index?: number;
}

const VisaCardPremium = ({ visa, isPopular, index = 0 }: VisaCardPremiumProps) => {
  const hasDiscount = visa.original_price && visa.original_price > visa.price;
  const discountPercent = hasDiscount
    ? Math.round(((visa.original_price! - visa.price) / visa.original_price!) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/visa-services/${visa.slug}`} className="block group">
        <div className={cn(
          "relative overflow-hidden rounded-2xl border transition-all duration-500",
          "bg-gradient-to-br from-card via-card to-muted/20",
          "hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-1",
          "backdrop-blur-xl",
          isPopular && "ring-2 ring-secondary"
        )}>
          {/* Decorative gradient corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-secondary/10 to-transparent rounded-bl-full" />
          
          {/* Popular Badge */}
          {isPopular && (
            <div className="absolute -top-0 left-0 right-0">
              <div className="bg-secondary text-secondary-foreground text-center py-2 text-sm font-medium">
                <Star className="w-4 h-4 inline mr-1.5 fill-current" />
                Most Popular Choice
              </div>
            </div>
          )}

          <div className={cn("p-6", isPopular && "pt-12")}>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {visa.is_express && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg shadow-amber-500/20">
                      <Zap className="w-3 h-3 mr-1" />
                      Express
                    </Badge>
                  )}
                  {hasDiscount && (
                    <Badge variant="destructive" className="shadow-lg shadow-destructive/20">
                      {discountPercent}% OFF
                    </Badge>
                  )}
                </div>
                <h3 className="font-bold text-xl group-hover:text-secondary transition-colors">
                  {visa.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{visa.visa_type}</p>
              </div>
              
              {/* Duration Badge */}
              {visa.duration_days && (
                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20">
                  <span className="text-2xl font-bold text-secondary">{visa.duration_days}</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Days</span>
                </div>
              )}
            </div>

            {/* Quick Info Pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm">
                <Clock className="w-3.5 h-3.5 text-secondary" />
                <span>{visa.processing_time}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/50 text-sm">
                <FileText className="w-3.5 h-3.5 text-secondary" />
                <span>{visa.validity || "60 Days Validity"}</span>
              </div>
            </div>

            {/* Description */}
            {visa.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-5">
                {visa.description}
              </p>
            )}

            {/* Included Items */}
            {visa.included.length > 0 && (
              <div className="space-y-2 mb-6">
                {visa.included.slice(0, 3).map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
                {visa.included.length > 3 && (
                  <p className="text-xs text-secondary font-medium pl-7">
                    +{visa.included.length - 3} more benefits
                  </p>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-dashed my-5" />

            {/* Price & CTA */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Starting from</p>
                <div className="flex items-baseline gap-2">
                  {hasDiscount && (
                    <span className="text-sm text-muted-foreground line-through">
                      AED {visa.original_price}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-secondary">
                    AED {visa.price}
                  </span>
                </div>
              </div>
              
              <Button 
                className={cn(
                  "gap-2 rounded-xl transition-all duration-300",
                  "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
                  "group-hover:gap-3"
                )}
              >
                Apply Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default VisaCardPremium;
