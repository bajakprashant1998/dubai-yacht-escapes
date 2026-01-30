import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

const destinations = [
  {
    name: "Dubai Marina",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
    activities: 45,
    path: "/experiences?location=dubai-marina",
  },
  {
    name: "Palm Jumeirah",
    image: "https://images.unsplash.com/photo-1582672060674-bc2bd808a8b5?w=600&q=80",
    activities: 32,
    path: "/experiences?location=palm-jumeirah",
  },
  {
    name: "Downtown Dubai",
    image: "https://images.unsplash.com/photo-1546412414-e1885259563a?w=600&q=80",
    activities: 58,
    path: "/experiences?location=downtown",
  },
  {
    name: "Dubai Creek",
    image: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=600&q=80",
    activities: 28,
    path: "/experiences?location=dubai-creek",
  },
];

const PopularDestinations = memo(() => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-secondary font-semibold tracking-wider uppercase mb-3">
            Explore Dubai
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Popular Destinations
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the most iconic locations in Dubai with curated experiences
          </p>
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
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
                  
                  {/* Content overlay */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className="flex items-center gap-2 text-primary-foreground/80 text-sm mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{destination.activities} Activities</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-primary-foreground mb-3">
                      {destination.name}
                    </h3>
                    <div className="flex items-center gap-2 text-secondary font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <span>Explore</span>
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
