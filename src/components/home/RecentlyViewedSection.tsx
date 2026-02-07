import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

const RecentlyViewedSection = memo(() => {
  const { items, clearRecentlyViewed } = useRecentlyViewed();

  // Don't render if no items
  if (items.length === 0) {
    return null;
  }

  const displayItems = items.slice(0, 6);

  const getItemUrl = (item: typeof items[0]) => {
    if (item.type === "service" && item.categorySlug) {
      return `/dubai/services/${item.categorySlug}/${item.slug}`;
    }
    return `/tours/${item.slug}`;
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium mb-1">
                Recently Viewed
              </div>
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                Continue Exploring
              </h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearRecentlyViewed}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </motion.div>

        {/* Horizontal Scroll Carousel */}
        <div className="-mx-4 px-4">
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
            {displayItems.map((item, index) => (
              <motion.div
                key={`${item.type}-${item.id}`}
                className="flex-shrink-0 w-[280px] sm:w-[300px] snap-start"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={getItemUrl(item)}>
                  <div className="group bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-border">
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 bg-primary/80 text-primary-foreground text-xs font-medium rounded-md capitalize">
                          {item.type}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-secondary transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm">
                          <span className="text-muted-foreground">From </span>
                          <span className="font-bold text-primary">AED {item.price}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

RecentlyViewedSection.displayName = "RecentlyViewedSection";

export default RecentlyViewedSection;
