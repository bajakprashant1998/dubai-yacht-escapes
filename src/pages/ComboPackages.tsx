import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ComboCard from "@/components/combo/ComboCard";
import ComboFilters from "@/components/combo/ComboFilters";
import { useComboPackages } from "@/hooks/useComboPackages";
import { Skeleton } from "@/components/ui/skeleton";

const ComboPackages = () => {
  const [activeType, setActiveType] = useState("all");
  const { data: combos, isLoading } = useComboPackages({ type: activeType === "all" ? undefined : activeType });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-6">
              <Package className="w-4 h-4" />
              Bundle & Save
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">
              Dubai Combo Tour Packages
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Save up to 25% with our curated combo packages. Hotel, transport, activities — all included in one seamless experience.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span>AI-Customizable</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full" />
                <span>Best Price Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full" />
                <span>24/7 Support</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border bg-muted/30">
        <div className="container">
          <ComboFilters activeType={activeType} onTypeChange={setActiveType} />
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
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Packages Found</h3>
              <p className="text-muted-foreground">
                {activeType === "all" 
                  ? "No combo packages are available at the moment." 
                  : `No ${activeType} packages available. Try another category.`}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ComboPackages;
