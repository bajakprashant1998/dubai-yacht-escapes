import { Link } from "react-router-dom";
import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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

const CategoryShowcase = memo(() => {
  const { data: categories, isLoading } = useActiveServiceCategories();

  // Show top 8 categories
  const displayCategories = categories?.slice(0, 8) || [];

  if (isLoading) {
    return (
      <section className="py-12 md:py-20">
        <div className="container">
          <div className="text-center mb-10">
            <Skeleton className="h-8 w-64 mx-auto mb-3" />
            <Skeleton className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-muted/30">
      <div className="container">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Explore Dubai <span className="text-secondary">Experiences</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From thrilling adventures to serene escapes, discover the perfect experience for every traveler
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                to={`/dubai/services/${category.slug}`}
                className="group relative block aspect-[4/3] rounded-xl overflow-hidden"
              >
                <img
                  src={categoryImages[category.slug] || category.imageUrl || "/placeholder.svg"}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4">
                  <h3 className="font-display font-semibold text-sm md:text-base text-primary-foreground mb-0.5 md:mb-1 group-hover:text-secondary transition-colors">
                    {category.name}
                  </h3>
                  {category.serviceCount !== undefined && (
                    <p className="text-xs text-primary-foreground/70">
                      {category.serviceCount} experiences
                    </p>
                  )}
                </div>

                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-secondary/0 group-hover:bg-secondary flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100">
                  <ArrowRight className="w-4 h-4 text-secondary-foreground" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Link
            to="/experiences"
            className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all"
          >
            View All Categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

CategoryShowcase.displayName = "CategoryShowcase";

export default CategoryShowcase;
