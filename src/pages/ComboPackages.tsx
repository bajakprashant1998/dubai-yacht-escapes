import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Sparkles, Shield, Clock, Star, MapPin, Users, Percent, ArrowRight, TrendingUp, Award } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ComboCard from "@/components/combo/ComboCard";
import ComboFilters from "@/components/combo/ComboFilters";
import SEOHead, { createBreadcrumbSchema } from "@/components/SEOHead";
import { useComboPackages } from "@/hooks/useComboPackages";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { icon: Users, value: "8,500+", label: "Happy Travelers" },
  { icon: Star, value: "4.9★", label: "Average Rating" },
  { icon: TrendingUp, value: "25%", label: "Avg. Savings" },
  { icon: Award, value: "50+", label: "Curated Combos" },
];

const valueProps = [
  { icon: Percent, title: "Save Up to 25%", desc: "Bundled pricing beats booking activities separately" },
  { icon: Shield, title: "Best Price Guarantee", desc: "Find it cheaper? We'll match it instantly" },
  { icon: Sparkles, title: "AI-Customizable", desc: "Personalize any package to your travel style" },
  { icon: Clock, title: "Instant Confirmation", desc: "Book now, get confirmed in under 60 seconds" },
  { icon: MapPin, title: "Free Hotel Pickup", desc: "Complimentary transfers on select packages" },
  { icon: Users, title: "24/7 Support", desc: "Dedicated concierge throughout your trip" },
];

const ComboPackages = () => {
  const [activeType, setActiveType] = useState("all");
  const { data: combos, isLoading } = useComboPackages({ type: activeType === "all" ? undefined : activeType });

  const featuredCombos = combos?.filter(c => c.is_featured) || [];
  const regularCombos = combos?.filter(c => !c.is_featured) || [];

  return (
    <Layout>
      <SEOHead
        title="Dubai Combo Tour Packages – Save Up to 25%"
        description="Bundle Dubai's best experiences and save up to 25%. All-inclusive combo packages with hotels, transport, activities & visa. AI-customizable itineraries."
        canonical="/combo-packages"
        keywords={["dubai combo packages", "dubai tour bundles", "dubai holiday packages", "all inclusive dubai", "save on dubai tours"]}
        structuredData={createBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Combo Packages", url: "/combo-packages" },
        ])}
      />

      {/* Hero Section */}
      <section className="relative bg-primary pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(255,255,255,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.05),transparent_40%)]" />
        </div>
        <div className="absolute top-16 right-[10%] w-80 h-80 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 left-[5%] w-64 h-64 bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />
        {/* Geometric pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30 text-sm px-5 py-2.5 backdrop-blur-sm">
                <Package className="w-4 h-4 mr-2" />
                Bundle & Save Up to 25%
              </Badge>
            </motion.div>
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-5 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Dubai Combo Tour
              <span className="block text-secondary">Packages</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Pre-curated travel experiences with hotels, transport, activities & visa — all bundled 
              at unbeatable prices. Customizable via our AI Trip Planner.
            </motion.p>

            {/* CTA */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl h-12 px-8 font-semibold"
                onClick={() => document.getElementById("packages-grid")?.scrollIntoView({ behavior: "smooth" })}
              >
                Browse Packages <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Link to="/trip-planner">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 rounded-xl h-12 px-8">
                  <Sparkles className="w-4 h-4 mr-2" /> AI Trip Planner
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Stats Strip */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-14 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center bg-primary-foreground/5 backdrop-blur-sm rounded-xl py-4 px-3 border border-primary-foreground/10">
                <stat.icon className="w-5 h-5 text-secondary mx-auto mb-1.5" />
                <p className="text-xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-xs text-primary-foreground/50">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border bg-background sticky top-[72px] z-20 backdrop-blur-lg bg-background/95">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <ComboFilters activeType={activeType} onTypeChange={setActiveType} />
            {combos && (
              <Badge variant="outline" className="text-xs whitespace-nowrap shrink-0">
                {combos.length} package{combos.length !== 1 ? "s" : ""} found
              </Badge>
            )}
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      {featuredCombos.length > 0 && activeType === "all" && (
        <section className="py-12 bg-gradient-to-b from-secondary/5 to-transparent">
          <div className="container">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Featured Packages</h2>
                <p className="text-sm text-muted-foreground">Our most popular bundles hand-picked for you</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCombos.map((combo, index) => (
                <motion.div
                  key={combo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                >
                  <ComboCard combo={combo} className="ring-2 ring-secondary/20" />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Packages Grid */}
      <section id="packages-grid" className="py-12 md:py-16">
        <div className="container">
          {activeType === "all" && featuredCombos.length > 0 && regularCombos.length > 0 && (
            <h2 className="text-xl font-bold mb-6">All Packages</h2>
          )}

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
          ) : (activeType === "all" ? regularCombos : combos || []).length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {(activeType === "all" ? regularCombos : combos || []).map((combo, index) => (
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
              <Package className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Packages Found</h3>
              <p className="text-muted-foreground mb-6">
                {activeType === "all" 
                  ? "No combo packages are available at the moment." 
                  : `No ${activeType} packages available. Try another category.`}
              </p>
              {activeType !== "all" && (
                <Button variant="outline" onClick={() => setActiveType("all")} className="rounded-xl">
                  View All Packages
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Why Choose Combo Section */}
      <section className="py-14 bg-muted/30 border-t border-border/50">
        <div className="container">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Why Book a Combo Package?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything planned, bundled, and discounted — so you focus on the experience, not the logistics.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {valueProps.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <Card className="h-full border-border/50 hover:border-secondary/30 transition-colors">
                  <CardContent className="p-5 text-center">
                    <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-3">
                      <item.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 bg-primary">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-8 h-8 text-secondary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
              Can't Find the Perfect Combo?
            </h2>
            <p className="text-primary-foreground/60 max-w-lg mx-auto mb-6">
              Use our AI Trip Planner to build a fully customized itinerary tailored to your budget, dates, and preferences.
            </p>
            <Link to="/trip-planner">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl h-12 px-8 font-semibold">
                <Sparkles className="w-4 h-4 mr-2" /> Launch AI Trip Planner
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default ComboPackages;
