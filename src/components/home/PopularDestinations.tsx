import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Star, TrendingUp, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const destinations = [
  {
    name: "Dubai Marina",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    activities: 45,
    path: "/experiences?location=dubai-marina",
    rating: 4.9,
    trending: true,
    description: "Waterfront living at its finest",
  },
  {
    name: "Palm Jumeirah",
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600&q=80",
    activities: 32,
    path: "/experiences?location=palm-jumeirah",
    rating: 4.8,
    trending: false,
    description: "Iconic man-made island",
  },
  {
    name: "Downtown Dubai",
    image: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=600&q=80",
    activities: 58,
    path: "/experiences?location=downtown",
    rating: 4.9,
    trending: true,
    description: "Heart of modern Dubai",
  },
  {
    name: "Dubai Creek",
    image: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=600&q=80",
    activities: 28,
    path: "/experiences?location=dubai-creek",
    rating: 4.7,
    trending: false,
    description: "Historic trading hub",
  },
];

const PopularDestinations = memo(() => {
  const { t } = useI18n();
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
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
              <span className="text-sm font-semibold">Explore Dubai</span>
            </motion.div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t("home.popular_destinations")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Discover the most iconic locations in Dubai with curated experiences
            </p>
          </div>
          
          <Link 
            to="/experiences" 
            className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all group"
          >
            {t("home.view_all")}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <motion.div
              key={destination.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={destination.path} className="group block">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
                  
                  {/* Trending badge */}
                  {destination.trending && (
                    <motion.div 
                      className="absolute top-4 left-4 flex items-center gap-1.5 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-xs font-bold"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                    >
                      <TrendingUp className="w-3 h-3" />
                      Trending
                    </motion.div>
                  )}

                  {/* Rating badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-bold text-foreground">{destination.rating}</span>
                  </div>
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{destination.activities} Activities</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-primary-foreground mb-1">
                      {destination.name}
                    </h3>
                    <p className="text-primary-foreground/70 text-sm mb-3">
                      {destination.description}
                    </p>
                    <div className="flex items-center gap-2 text-secondary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span>Explore Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

PopularDestinations.displayName = "PopularDestinations";

export default PopularDestinations;
