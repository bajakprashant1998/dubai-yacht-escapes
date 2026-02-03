import { Link } from "react-router-dom";
import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";
import { useActiveServiceCategories } from "@/hooks/useServiceCategories";
import { Skeleton } from "@/components/ui/skeleton";

const categoryImages: Record<string, string> = {
  "desert-safari": "/assets/services/desert-safari.jpg",
  "theme-parks": "/assets/services/theme-parks.jpg",
  "observation-decks": "/assets/services/observation-decks.jpg",
  "water-sports": "/assets/services/water-sports.jpg",
  "museums-attractions": "/assets/services/museums-attractions.jpg",
  "zoos-aquariums": "/assets/services/zoos-aquariums.jpg",
  "water-parks": "/assets/services/water-parks.jpg",
  "parks-gardens": "/assets/services/parks-gardens.jpg",
  "city-tours": "/assets/services/city-tours.jpg",
  "sightseeing-cruises": "/assets/services/sightseeing-cruises.jpg",
  "adventure-sports": "/assets/services/adventure-sports.jpg",
  "dining-experiences": "/assets/services/dining-experiences.jpg",
  "airport-transfers": "/assets/services/airport-transfers.jpg",
  "attraction-passes": "/assets/services/attraction-passes.jpg",
};

// Featured categories with extra data
const featuredSlugs = ["desert-safari", "theme-parks", "sightseeing-cruises", "adventure-sports"];

const CategoryShowcase = memo(() => {
  const { data: categories, isLoading } = useActiveServiceCategories();

  // Show top 8 categories
  const displayCategories = categories?.slice(0, 8) || [];

  if (isLoading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-3" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/50 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <motion.div 
              className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Curated Experiences</span>
            </motion.div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Explore Dubai <span className="text-secondary">Experiences</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              From thrilling adventures to serene escapes, discover the perfect experience for every traveler
            </p>
          </div>

          <Link
            to="/experiences"
            className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all group"
          >
            View All Categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayCategories.map((category, index) => {
            const isFeatured = featuredSlugs.includes(category.slug);
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={index === 0 ? "md:col-span-2 md:row-span-2" : ""}
              >
                <Link
                  to={`/dubai/services/${category.slug}`}
                  className={`group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${
                    index === 0 ? "aspect-square md:aspect-auto md:h-full" : "aspect-[4/3]"
                  }`}
                >
                  <img
                    src={categoryImages[category.slug] || category.imageUrl || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent group-hover:from-primary/90 transition-all duration-300" />
                  
                  {/* Featured badge */}
                  {isFeatured && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-bold">
                      <TrendingUp className="w-3 h-3" />
                      Popular
                    </div>
                  )}

                  {/* Experience count badge */}
                  {category.serviceCount !== undefined && category.serviceCount > 0 && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs font-bold text-foreground">{category.serviceCount}</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5">
                    <h3 className={`font-display font-bold text-primary-foreground mb-1 group-hover:text-secondary transition-colors ${
                      index === 0 ? "text-xl md:text-2xl" : "text-base md:text-lg"
                    }`}>
                      {category.name}
                    </h3>
                    {category.description && index === 0 && (
                      <p className="text-primary-foreground/70 text-sm line-clamp-2 mb-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-secondary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

CategoryShowcase.displayName = "CategoryShowcase";

export default CategoryShowcase;
