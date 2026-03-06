import { motion } from "framer-motion";
import { Star, Clock, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Recommendation {
  type: "tour" | "service" | "combo";
  id: string;
  title: string;
  price: number;
  original_price?: number;
  duration?: string;
  rating?: number;
  slug: string;
  reason: string;
}

interface RecommendationCardProps {
  recommendations: Recommendation[];
}

const typeConfig = {
  tour: { label: "Tour", path: "/tours", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  service: { label: "Activity", path: "/services", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  combo: { label: "Package", path: "/combo-packages", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
};

const RecommendationCard = ({ recommendations }: RecommendationCardProps) => {
  const navigate = useNavigate();

  const handleClick = (rec: Recommendation) => {
    const config = typeConfig[rec.type];
    navigate(`${config.path}/${rec.slug}`);
  };

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-1.5 px-1">
        <Sparkles className="w-3 h-3 text-secondary" />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Recommended for you
        </span>
      </div>
      {recommendations.map((rec, index) => {
        const config = typeConfig[rec.type];
        return (
          <motion.button
            key={rec.id || index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.2 }}
            onClick={() => handleClick(rec)}
            className="w-full text-left bg-card hover:bg-accent/50 border border-border rounded-xl p-3 transition-all duration-200 hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group cursor-pointer"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                {/* Type badge */}
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${config.color} mb-1.5`}>
                  {config.label}
                </span>
                
                {/* Title */}
                <h4 className="text-sm font-semibold text-foreground leading-tight truncate">
                  {rec.title}
                </h4>
                
                {/* Reason */}
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                  {rec.reason}
                </p>

                {/* Meta row */}
                <div className="flex items-center gap-3 mt-1.5">
                  {rec.rating && (
                    <span className="flex items-center gap-0.5 text-[11px] text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {rec.rating}
                    </span>
                  )}
                  {rec.duration && (
                    <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {rec.duration}
                    </span>
                  )}
                </div>
              </div>

              {/* Price + arrow */}
              <div className="flex flex-col items-end shrink-0">
                {rec.original_price && rec.original_price > rec.price && (
                  <span className="text-[10px] text-muted-foreground line-through">
                    {rec.original_price} AED
                  </span>
                )}
                <span className="text-sm font-bold text-secondary">
                  {rec.price} AED
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-secondary mt-1 transition-colors" />
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default RecommendationCard;
