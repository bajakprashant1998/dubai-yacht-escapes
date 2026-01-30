import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ComboCard from "@/components/combo/ComboCard";
import { useFeaturedComboPackages } from "@/hooks/useComboPackages";

const FeaturedCombos = memo(() => {
  const { data: featuredCombos = [], isLoading } = useFeaturedComboPackages();

  return (
    <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
      <div className="container">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-secondary" />
              <p className="text-secondary font-semibold tracking-wider uppercase">
                Bundle & Save
              </p>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Featured Combo Packages
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              Experience more and save big with our curated multi-day packages
            </p>
          </div>
          <Link to="/combo-packages" className="mt-6 md:mt-0">
            <Button variant="outline" size="lg" className="font-semibold group">
              View All Packages
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-2xl overflow-hidden shadow-md">
                <Skeleton className="aspect-[16/10] w-full" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-4 pt-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Combos Grid */}
        {!isLoading && featuredCombos.length > 0 && (
          <>
            {/* Mobile: Horizontal scroll carousel */}
            <div className="lg:hidden -mx-4 px-4">
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
                {featuredCombos.slice(0, 4).map((combo) => (
                  <div
                    key={combo.id}
                    className="flex-shrink-0 w-[85%] sm:w-[75%] snap-start"
                  >
                    <ComboCard combo={combo} />
                  </div>
                ))}
              </div>
              {/* Scroll indicator */}
              <div className="flex justify-center gap-1.5 mt-2">
                {featuredCombos.slice(0, 4).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${index === 0 ? 'bg-secondary w-4' : 'bg-muted-foreground/30'}`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop: Grid layout */}
            <motion.div
              className="hidden lg:grid lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
            >
              {featuredCombos.slice(0, 3).map((combo) => (
                <div key={combo.id}>
                  <ComboCard combo={combo} />
                </div>
              ))}
            </motion.div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && featuredCombos.length === 0 && (
          <div className="text-center py-16 bg-muted/30 rounded-2xl">
            <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">No featured packages available at the moment.</p>
            <Link to="/combo-packages">
              <Button>Browse All Packages</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
});

FeaturedCombos.displayName = "FeaturedCombos";

export default FeaturedCombos;
