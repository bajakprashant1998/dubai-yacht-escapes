import { Clock, Hotel, Car, FileText, Ticket, Star, Users, Sparkles } from "lucide-react";
import type { ComboPackage } from "@/hooks/useComboPackages";

interface ComboQuickInfoProps {
  combo: ComboPackage;
}

const ComboQuickInfo = ({ combo }: ComboQuickInfoProps) => {
  const infoItems = [
    {
      icon: Clock,
      label: "Duration",
      value: `${combo.duration_days} Days / ${combo.duration_nights} Nights`,
      show: true,
    },
    {
      icon: Hotel,
      label: "Accommodation",
      value: combo.includes_hotel
        ? `${combo.hotel_star_rating || 4}-Star Hotel`
        : "Not Included",
      show: true,
    },
    {
      icon: Car,
      label: "Transport",
      value: combo.includes_transport
        ? (combo.transport_type || "Private").charAt(0).toUpperCase() + (combo.transport_type || "private").slice(1)
        : "Not Included",
      show: true,
    },
    {
      icon: FileText,
      label: "Visa",
      value: combo.includes_visa ? "Included" : "Not Included",
      show: combo.includes_visa,
    },
    {
      icon: Ticket,
      label: "Activities",
      value: `${combo.items?.length || 0} Experiences`,
      show: (combo.items?.length || 0) > 0,
    },
  ].filter((item) => item.show);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {infoItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50"
        >
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
            <item.icon className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="text-sm font-medium text-foreground">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComboQuickInfo;
