import { Link } from "react-router-dom";
import { memo } from "react";
import { motion } from "framer-motion";
import { Sun, FerrisWheel, Waves, Ship, MapPin, Mountain, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";

import desertSafariImg from "@/assets/services/desert-safari.jpg";
import themeParksImg from "@/assets/services/theme-parks.jpg";
import waterSportsImg from "@/assets/services/water-sports.jpg";
import cityToursImg from "@/assets/services/city-tours.jpg";
import adventureImg from "@/assets/services/adventure-sports.jpg";
import dhowCruiseImg from "@/assets/tours/dhow-cruise-marina.webp";

const activities = [
  { icon: Sun, title: "Desert Safari", desc: "Dune bashing & BBQ dinners", image: desertSafariImg, price: 149, slug: "desert-safari" },
  { icon: FerrisWheel, title: "Theme Parks", desc: "World-class thrills & fun", image: themeParksImg, price: 245, slug: "theme-parks" },
  { icon: Waves, title: "Water Sports", desc: "Jet ski, flyboard & more", image: waterSportsImg, price: 199, slug: "water-sports" },
  { icon: Ship, title: "Dhow Cruises", desc: "Marina & Creek dinner cruises", image: dhowCruiseImg, price: 129, slug: "sightseeing-cruises" },
  { icon: MapPin, title: "City Tours", desc: "Old & modern Dubai highlights", image: cityToursImg, price: 99, slug: "city-tours" },
  { icon: Mountain, title: "Adventure Sports", desc: "Skydiving, zip-line & more", image: adventureImg, price: 299, slug: "adventure-sports" },
];

const PopularActivities = memo(() => {
  const { t } = useI18n();
  return (
    <section className="py-20 sm:py-24 bg-muted/30 relative overflow-hidden">
      {/* Subtle decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-secondary/5 rounded-full blur-3xl -translate-y-1/2" />
      </div>

      <div className="container relative">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20 text-sm px-4 py-1.5">
            {t("home.popular_experiences")}
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("home.popular_activities")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Handpicked experiences loved by thousands of travellers visiting Dubai
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
          {activities.map((activity, index) => (
            <Link key={activity.slug} to={`/experiences?category=${activity.slug}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer aspect-[4/5] sm:aspect-[3/4]"
              >
                {/* Image */}
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/85 transition-all duration-500" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 md:p-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors">
                      <activity.icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white">{activity.title}</h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-white/70 mb-2.5 line-clamp-1">{activity.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary/90 text-secondary-foreground text-[11px] sm:text-xs font-semibold">
                      From AED {activity.price}
                    </span>
                    <span className="text-white/0 group-hover:text-white/80 transition-all duration-300 text-xs flex items-center gap-1">
                      Explore <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

PopularActivities.displayName = "PopularActivities";
export default PopularActivities;
