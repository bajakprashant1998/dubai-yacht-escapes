import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
  viewReportLink?: string;
  className?: string;
  animationDelay?: number;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType = "neutral",
  subtitle,
  viewReportLink,
  className,
  animationDelay = 0,
}: StatCardProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-card rounded-2xl p-4 sm:p-5 lg:p-6 border border-border/50",
        "card-elevated card-shine",
        "transition-all duration-500 hover:-translate-y-1",
        "animate-fade-in group",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Subtle decorative gradient */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-secondary/5 to-transparent rounded-bl-full pointer-events-none" />

      <div className="flex items-start justify-between gap-3 relative">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 truncate">
            {title}
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground mb-1.5 animate-count-up truncate tracking-tight">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  changeType === "positive" &&
                    "bg-emerald-500/10 text-emerald-600",
                  changeType === "negative" && "bg-rose-500/10 text-rose-600",
                  changeType === "neutral" && "bg-muted text-muted-foreground"
                )}
              >
                {change}
              </span>
              {subtitle && (
                <span className="text-xs text-muted-foreground">{subtitle}</span>
              )}
            </div>
          )}
          {viewReportLink && (
            <a
              href={viewReportLink}
              className="text-xs sm:text-sm text-secondary hover:underline mt-2 inline-block font-medium"
            >
              View Report →
            </a>
          )}
        </div>
        <div className="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-secondary/20 via-secondary/10 to-transparent rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-secondary/10 flex-shrink-0 border border-secondary/10">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
