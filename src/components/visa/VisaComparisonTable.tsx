import { Check, X, Star, Zap } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VisaService } from "@/hooks/useVisaServices";
import { Link } from "react-router-dom";

interface VisaComparisonTableProps {
  visas: VisaService[];
}

const features = [
  { key: "duration", label: "Duration" },
  { key: "processing", label: "Processing Time" },
  { key: "validity", label: "Validity" },
  { key: "entries", label: "Entry Type" },
  { key: "express", label: "Express Available" },
  { key: "extension", label: "Can Be Extended" },
];

const VisaComparisonTable = ({ visas }: VisaComparisonTableProps) => {
  // Get top 3 visa types for comparison
  const comparisonVisas = visas.slice(0, 3);

  if (comparisonVisas.length === 0) return null;

  const getFeatureValue = (visa: VisaService, key: string) => {
    switch (key) {
      case "duration":
        return visa.duration_days ? `${visa.duration_days} Days` : "N/A";
      case "processing":
        return visa.processing_time || "3-5 Days";
      case "validity":
        return visa.validity || "60 Days";
      case "entries":
        return visa.visa_type?.toLowerCase().includes("multi") ? "Multiple" : "Single";
      case "express":
        return visa.is_express;
      case "extension":
        return visa.duration_days && visa.duration_days >= 30;
      default:
        return "N/A";
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[768px]">
        {/* Header Row */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="p-4">
            <h3 className="text-lg font-semibold">Compare Visa Types</h3>
            <p className="text-sm text-muted-foreground">Find the right visa for your needs</p>
          </div>
          
          {comparisonVisas.map((visa, index) => (
            <Card 
              key={visa.id} 
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:shadow-xl",
                index === 1 && "border-secondary ring-2 ring-secondary/20"
              )}
            >
              {index === 1 && (
                <div className="absolute top-0 left-0 right-0 bg-secondary text-secondary-foreground text-center py-1 text-xs font-medium">
                  <Star className="w-3 h-3 inline mr-1" />
                  Most Popular
                </div>
              )}
              <CardHeader className={cn("pb-2", index === 1 && "pt-8")}>
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold">{visa.title}</h4>
                    <p className="text-xs text-muted-foreground">{visa.visa_type}</p>
                  </div>
                  {visa.is_express && (
                    <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border-amber-200">
                      <Zap className="w-3 h-3 mr-1" />
                      Express
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-baseline gap-1 mb-3">
                  <span className="text-3xl font-bold text-secondary">AED {visa.price}</span>
                  {visa.original_price && visa.original_price > visa.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      AED {visa.original_price}
                    </span>
                  )}
                </div>
                <Link to={`/visa-services/${visa.slug}`}>
                  <Button 
                    className={cn(
                      "w-full",
                      index === 1 
                        ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground" 
                        : "variant-outline"
                    )}
                    variant={index === 1 ? "default" : "outline"}
                  >
                    Apply Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Rows */}
        <div className="bg-card rounded-xl border overflow-hidden">
          {features.map((feature, fIndex) => (
            <div 
              key={feature.key} 
              className={cn(
                "grid grid-cols-4 gap-4",
                fIndex % 2 === 0 ? "bg-muted/30" : "bg-transparent"
              )}
            >
              <div className="p-4 font-medium text-sm">{feature.label}</div>
              
              {comparisonVisas.map((visa) => {
                const value = getFeatureValue(visa, feature.key);
                const isBoolean = typeof value === "boolean";
                
                return (
                  <div key={visa.id} className="p-4 text-center">
                    {isBoolean ? (
                      value ? (
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/10">
                          <Check className="w-5 h-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                          <X className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )
                    ) : (
                      <span className="text-sm font-medium">{value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisaComparisonTable;
