import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ComboCard from "@/components/combo/ComboCard";
import ComboFilters from "@/components/combo/ComboFilters";
import { useComboPackages } from "@/hooks/useComboPackages";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const ComboPackages = () => {
  const [activeType, setActiveType] = useState("all");
  const { data: combos, isLoading } = useComboPackages({ type: activeType === "all" ? undefined : activeType });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-primary py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
        {/* Decorative orbs */}
        <div className="absolute top-16 right-[15%] w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-[5%] w-56 h-56 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30 text-sm px-4 py-2">
              <Package className="w-4 h-4 mr-2" />
              Bundle & Save
            </Badge>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Dubai Combo Tour Packages
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Save up to 25% with our curated combo packages. Hotel, transport, activities — all included in one seamless experience.
          </motion.p>
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-primary-foreground/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
              <span>AI-Customizable</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 bg-secondary rounded-full" />
              <span>Best Price Guaranteed</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-secondary rounded-full" />
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border bg-background">
        <div className="container">
          <div className="bg-card rounded-xl border border-border p-4">
            <ComboFilters activeType={activeType} onTypeChange={setActiveType} />
            {combos && (
              <div className="mt-3 pt-3 border-t border-border">
                <Badge variant="secondary" className="text-xs">
                  {combos.length} packages found
                </Badge>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-12 md:py-16">
        <div className="container">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[16/10] rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-1/2" />
                </div>
              ))}
            </div>
          ) : combos && combos.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {combos.map((combo, index) => (
                <motion.div
                  key={combo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ComboCard combo={combo} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Packages Found</h3>
              <p className="text-muted-foreground">
                {activeType === "all" 
                  ? "No combo packages are available at the moment." 
                  : `No ${activeType} packages available. Try another category.`}
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ComboPackages;
