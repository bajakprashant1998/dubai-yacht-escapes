import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useBanners } from "@/hooks/useBanners";

const PromotionalBanner = memo(() => {
  const { data: banners = [] } = useBanners("homepage_top");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visibleBanners = banners.filter((b) => !dismissed.has(b.id));

  if (!visibleBanners.length) return null;

  const banner = visibleBanners[0];

  return (
    <AnimatePresence>
      <motion.div
        key={banner.id}
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden"
        style={{ backgroundColor: banner.bg_color, color: banner.text_color }}
      >
        <div className="container py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <span className="text-sm md:text-base font-semibold truncate">
              {banner.title}
            </span>
            {banner.subtitle && (
              <span className="hidden md:inline text-sm opacity-80">
                {banner.subtitle}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {banner.link_url && (
              <Link
                to={banner.link_url}
                className="text-sm font-semibold flex items-center gap-1 hover:underline"
              >
                {banner.link_text || "Learn More"}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            <button
              onClick={() => setDismissed((prev) => new Set(prev).add(banner.id))}
              className="opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

PromotionalBanner.displayName = "PromotionalBanner";
export default PromotionalBanner;
