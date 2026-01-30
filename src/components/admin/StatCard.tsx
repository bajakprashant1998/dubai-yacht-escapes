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
        "bg-card rounded-xl p-3 sm:p-4 lg:p-6 border border-border shadow-sm",
        "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
        "animate-fade-in",
        className
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs lg:text-sm font-medium text-muted-foreground mb-0.5 sm:mb-1 truncate">
            {title}
          </p>
          <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground mb-0.5 sm:mb-1 animate-count-up truncate">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded",
                  changeType === "positive" &&
                    "bg-emerald-500/10 text-emerald-600",
                  changeType === "negative" && "bg-rose-500/10 text-rose-600",
                  changeType === "neutral" && "bg-muted text-muted-foreground"
                )}
              >
                {change}
              </span>
              {subtitle && (
                <span className="text-[10px] sm:text-xs text-muted-foreground">{subtitle}</span>
              )}
            </div>
          )}
          {viewReportLink && (
            <a
              href={viewReportLink}
              className="text-[10px] sm:text-xs lg:text-sm text-secondary hover:underline mt-1 sm:mt-2 inline-block"
            >
              View Report →
            </a>
          )}
        </div>
        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-lg lg:rounded-xl flex items-center justify-center transition-transform hover:scale-105 flex-shrink-0">
          <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-secondary" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
