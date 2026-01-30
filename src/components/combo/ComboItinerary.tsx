import { Clock, MapPin, Check } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ComboPackageItem } from "@/hooks/useComboPackages";

interface ComboItineraryProps {
  items: ComboPackageItem[];
  totalDays: number;
}

const ComboItinerary = ({ items, totalDays }: ComboItineraryProps) => {
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);

  // Group items by day
  const itemsByDay: Record<number, ComboPackageItem[]> = {};
  for (let day = 1; day <= totalDays; day++) {
    itemsByDay[day] = items.filter((item) => item.day_number === day);
  }

  const toggleDay = (day: number) => {
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
        const dayItems = itemsByDay[day] || [];
        const isExpanded = expandedDays.includes(day);

        return (
          <Collapsible key={day} open={isExpanded} onOpenChange={() => toggleDay(day)}>
            <CollapsibleTrigger asChild>
              <div className={cn(
                "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all",
                isExpanded ? "bg-secondary/10 border border-secondary/20" : "bg-muted hover:bg-muted/80"
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg",
                    isExpanded ? "bg-secondary text-secondary-foreground" : "bg-primary/10 text-primary"
                  )}>
                    {day}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Day {day}</h3>
                    <p className="text-sm text-muted-foreground">
                      {dayItems.length} {dayItems.length === 1 ? "activity" : "activities"}
                    </p>
                  </div>
                </div>
                <ChevronDown className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform",
                  isExpanded && "rotate-180"
                )} />
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="mt-3 ml-6 border-l-2 border-secondary/20 pl-6 space-y-4">
                {dayItems.length > 0 ? (
                  dayItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="relative p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow"
                    >
                      {/* Timeline dot */}
                      <div className="absolute -left-[31px] top-5 w-4 h-4 rounded-full bg-secondary border-2 border-background" />

                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {item.start_time && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {item.start_time}
                                {item.end_time && ` - ${item.end_time}`}
                              </span>
                            )}
                            <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground capitalize">
                              {item.item_type}
                            </span>
                          </div>
                          <h4 className="font-medium text-foreground">{item.title}</h4>
                          {item.description && (
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          )}
                        </div>
                        {item.is_mandatory && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <Check className="w-3 h-3" />
                            Included
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Free day or activities to be added
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
};

export default ComboItinerary;
