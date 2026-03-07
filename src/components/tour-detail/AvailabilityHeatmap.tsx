import { useState, useMemo } from "react";
import { Calendar, AlertCircle, CheckCircle2, TrendingDown, TrendingUp, DollarSign } from "lucide-react";
import { useTourAvailability, useServiceAvailability, getAvailabilityStatus, AvailabilitySlot } from "@/hooks/useAvailability";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isToday, isBefore } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface AvailabilityHeatmapProps {
  tourId?: string;
  serviceId?: string;
  basePrice?: number;
  onDateSelect?: (date: Date) => void;
}

type PriceTier = "deal" | "normal" | "peak" | "soldout" | "past" | "unknown";

const tierConfig: Record<PriceTier, { bg: string; text: string; label: string; ring?: string }> = {
  deal: { bg: "bg-emerald-100 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-400", label: "Great Deal", ring: "ring-emerald-300 dark:ring-emerald-700" },
  normal: { bg: "hover:bg-muted/80", text: "text-foreground", label: "Regular Price" },
  peak: { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-400", label: "Peak Price", ring: "ring-amber-300 dark:ring-amber-700" },
  soldout: { bg: "bg-muted", text: "text-muted-foreground/40", label: "Sold Out" },
  past: { bg: "", text: "text-muted-foreground/30", label: "Past" },
  unknown: { bg: "hover:bg-muted/80", text: "text-foreground", label: "Available" },
};

const AvailabilityHeatmap = ({ tourId, serviceId, basePrice, onDateSelect }: AvailabilityHeatmapProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: tourAvail = [], isLoading: tourLoading } = useTourAvailability(tourId);
  const { data: serviceAvail = [], isLoading: serviceLoading } = useServiceAvailability(serviceId);

  const availability = tourId ? tourAvail : serviceAvail;
  const isLoading = tourId ? tourLoading : serviceLoading;

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = monthStart.getDay();

  // Compute price range for the heatmap
  const priceStats = useMemo(() => {
    const prices = availability
      .filter((s) => s.special_price != null && s.is_available)
      .map((s) => s.special_price!);

    if (prices.length === 0 && basePrice) {
      return { min: basePrice * 0.85, max: basePrice * 1.2, avg: basePrice, hasVariation: false };
    }
    if (prices.length === 0) return null;

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    return { min, max, avg, hasVariation: max - min > 10 };
  }, [availability, basePrice]);

  const getSlotForDate = (date: Date): AvailabilitySlot | undefined => {
    const dateStr = format(date, "yyyy-MM-dd");
    return availability.find((s) => s.date === dateStr);
  };

  const getPriceTier = (slot: AvailabilitySlot | undefined, day: Date): PriceTier => {
    const isPast = isBefore(day, new Date()) && !isToday(day);
    if (isPast) return "past";
    if (slot && !slot.is_available) return "soldout";
    if (!slot) return "unknown";

    const price = slot.special_price;
    if (!price || !priceStats || !priceStats.hasVariation) return "normal";

    const threshold = (priceStats.max - priceStats.min) * 0.3;
    if (price <= priceStats.min + threshold) return "deal";
    if (price >= priceStats.max - threshold) return "peak";
    return "normal";
  };

  const handleSelect = (day: Date) => {
    setSelectedDate(day);
    onDateSelect?.(day);
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="bg-card rounded-xl p-5 shadow-md border border-border">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-secondary" />
            Availability & Pricing
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              ←
            </button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              →
            </button>
          </div>
        </div>

        {/* Price range bar */}
        {priceStats && priceStats.hasVariation && (
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="flex-1 h-2 rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-red-400 opacity-60" />
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3 text-emerald-500" />
                AED {Math.round(priceStats.min)}
              </span>
              <span className="flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3 text-amber-500" />
                AED {Math.round(priceStats.max)}
              </span>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: startDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {days.map((day) => {
                const slot = getSlotForDate(day);
                const tier = getPriceTier(slot, day);
                const config = tierConfig[tier];
                const { status, slotsLeft } = getAvailabilityStatus(slot);
                const isPast = tier === "past";
                const isSelected = selectedDate && day.getTime() === selectedDate.getTime();

                return (
                  <Tooltip key={day.toISOString()}>
                    <TooltipTrigger asChild>
                      <button
                        disabled={isPast || tier === "soldout"}
                        onClick={() => handleSelect(day)}
                        className={`
                          relative p-1.5 rounded-lg text-center text-sm transition-all
                          ${config.bg} ${config.text}
                          ${isPast ? "cursor-not-allowed" : "cursor-pointer"}
                          ${tier === "soldout" ? "line-through cursor-not-allowed" : ""}
                          ${isToday(day) ? "ring-1 ring-secondary font-bold" : ""}
                          ${isSelected ? `ring-2 ${config.ring || "ring-primary"} font-bold` : ""}
                        `}
                      >
                        {format(day, "d")}
                        {tier === "deal" && !isPast && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
                        )}
                        {status === "limited" && !isPast && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <div className="font-medium">{format(day, "EEE, MMM d")}</div>
                      {slot?.special_price && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <DollarSign className="w-3 h-3" />
                          AED {slot.special_price}
                          {tier === "deal" && <Badge variant="secondary" className="text-[8px] h-3.5 px-1 bg-emerald-100 text-emerald-700">Best Price</Badge>}
                        </div>
                      )}
                      {slotsLeft !== null && slotsLeft > 0 && (
                        <div className="text-muted-foreground mt-0.5">{slotsLeft} spots left</div>
                      )}
                      {tier === "soldout" && <div className="text-destructive">Sold Out</div>}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 mt-4 text-[10px] sm:text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300" />
            Best Price
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-foreground/50" />
            Regular
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-300" />
            Peak
          </div>
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            Limited
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-muted border" />
            Sold Out
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AvailabilityHeatmap;
