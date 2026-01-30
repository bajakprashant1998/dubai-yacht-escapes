import { Check, X } from "lucide-react";
import { VisaService } from "@/hooks/useVisaServices";

interface VisaRequirementsProps {
  visa: VisaService;
}

const VisaRequirements = ({ visa }: VisaRequirementsProps) => {
  return (
    <div className="space-y-6">
      {/* Requirements */}
      {visa.requirements.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3">Required Documents</h3>
          <ul className="space-y-2">
            {visa.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-medium text-secondary">{index + 1}</span>
                </div>
                <span className="text-muted-foreground">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Included */}
      {visa.included.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3">What's Included</h3>
          <ul className="space-y-2">
            {visa.included.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Excluded */}
      {visa.excluded.length > 0 && (
        <div>
          <h3 className="font-semibold text-lg mb-3">Not Included</h3>
          <ul className="space-y-2">
            {visa.excluded.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <X className="w-5 h-5 text-destructive flex-shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VisaRequirements;