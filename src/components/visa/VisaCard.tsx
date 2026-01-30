import { Link } from "react-router-dom";
import { Clock, FileText, Zap, Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VisaService } from "@/hooks/useVisaServices";

interface VisaCardProps {
  visa: VisaService;
}

const VisaCard = ({ visa }: VisaCardProps) => {
  const hasDiscount = visa.original_price && visa.original_price > visa.price;
  const discountPercent = hasDiscount
    ? Math.round(((visa.original_price! - visa.price) / visa.original_price!) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 h-full flex flex-col">
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg group-hover:text-secondary transition-colors">
              {visa.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{visa.visa_type}</p>
          </div>
          <div className="flex gap-2">
            {visa.is_express && (
              <Badge className="bg-amber-500 text-white">
                <Zap className="w-3 h-3 mr-1" />
                Express
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive">{discountPercent}% OFF</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col">
        <div className="flex-1 space-y-4">
          {/* Key Info */}
          <div className="flex flex-wrap gap-4 text-sm">
            {visa.duration_days && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <FileText className="w-4 h-4" />
                <span>{visa.duration_days} Days</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{visa.processing_time}</span>
            </div>
          </div>
          
          {/* Description */}
          {visa.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {visa.description}
            </p>
          )}
          
          {/* Included Items */}
          {visa.included.length > 0 && (
            <ul className="space-y-1">
              {visa.included.slice(0, 3).map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
              {visa.included.length > 3 && (
                <li className="text-sm text-muted-foreground pl-6">
                  +{visa.included.length - 3} more included
                </li>
              )}
            </ul>
          )}
        </div>
        
        {/* Price & CTA */}
        <div className="pt-4 mt-4 border-t flex items-center justify-between">
          <div>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through mr-2">
                AED {visa.original_price}
              </span>
            )}
            <span className="text-2xl font-bold text-secondary">
              AED {visa.price}
            </span>
          </div>
          <Link to={`/visa-services/${visa.slug}`}>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Apply Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisaCard;