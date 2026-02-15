import { useState } from "react";
import { Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTourAvailability, getAvailabilityStatus } from "@/hooks/useAvailability";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, isBefore } from "date-fns";

interface AvailabilityCalendarProps {
  tourId: string;
  onDateSelect?: (date: Date) => void;
}

const AvailabilityCalendar = ({ tourId, onDateSelect }: AvailabilityCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { data: availability = [], isLoading } = useTourAvailability(tourId);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDay = monthStart.getDay();

  const getSlotForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return availability.find((s) => s.date === dateStr);
  };

  return (
    <div className="bg-card rounded-xl p-5 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
          <Calendar className="w-5 h-5 text-secondary" />
          Availability
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            ←
          </button>
          <span className="text-sm font-medium min-w-[120px] text-center">{format(currentMonth, "MMMM yyyy")}</span>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            →
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {days.map((day) => {
          const slot = getSlotForDate(day);
          const { status, label } = getAvailabilityStatus(slot);
          const isPast = isBefore(day, new Date()) && !isToday(day);

          return (
            <button
              key={day.toISOString()}
              disabled={isPast || status === "soldout"}
              onClick={() => onDateSelect?.(day)}
              className={`
                relative p-1.5 rounded-lg text-center text-sm transition-all
                ${isPast ? "text-muted-foreground/30 cursor-not-allowed" : ""}
                ${status === "available" && !isPast ? "hover:bg-secondary/10 text-foreground cursor-pointer" : ""}
                ${status === "limited" ? "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400" : ""}
                ${status === "soldout" ? "bg-muted text-muted-foreground/40 line-through cursor-not-allowed" : ""}
                ${isToday(day) ? "ring-1 ring-secondary" : ""}
              `}
              title={label}
            >
              {format(day, "d")}
              {status === "limited" && !isPast && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3 h-3 text-green-500" />
          Available
        </div>
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3 h-3 text-amber-500" />
          Limited
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-muted border" />
          Sold Out
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
