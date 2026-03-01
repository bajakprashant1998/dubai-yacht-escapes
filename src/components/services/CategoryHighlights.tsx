import { motion } from "framer-motion";
import { 
  Ship, Anchor, Sunset, Music, UtensilsCrossed, Camera, 
  Users, MapPin, Clock, Star, Sparkles, Waves,
  Sun, Mountain, FerrisWheel, Building2, Fish, Flower2, 
  Car, Ticket, Droplets, Landmark, type LucideIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryHighlight {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface CategoryConfig {
  tagline: string;
  highlights: CategoryHighlight[];
  stats: { label: string; value: string }[];
  gradient: string;
}

const categoryConfigs: Record<string, CategoryConfig> = {
  "sightseeing-cruises": {
    tagline: "Sail through Dubai's iconic skyline with world-class dining & entertainment",
    highlights: [
      { icon: Ship, title: "Traditional Dhow Cruises", description: "Authentic wooden vessel dining experience along Dubai Creek & Marina" },
      { icon: UtensilsCrossed, title: "Gourmet Dining Onboard", description: "International buffet with live BBQ, fresh seafood & premium beverages" },
      { icon: Music, title: "Live Entertainment", description: "Tanura dance, live music performances & cultural shows during your cruise" },
      { icon: Sunset, title: "Sunset & Moonlight", description: "Choose from daytime, sunset, or moonlight departures for the perfect ambiance" },
      { icon: Camera, title: "Iconic Landmarks", description: "Cruise past Burj Al Arab, Atlantis, Marina skyline & Palm Jumeirah" },
      { icon: Anchor, title: "Private Charters", description: "Exclusive yacht charters from 33ft to 100ft with personalized itineraries" },
    ],
    stats: [
      { label: "Happy Guests", value: "15,000+" },
      { label: "Cruise Options", value: "12+" },
      { label: "Avg. Rating", value: "4.9★" },
      { label: "Years Experience", value: "8+" },
    ],
    gradient: "from-blue-500/10 via-cyan-500/5 to-transparent",
  },
  "desert-safari": {
    tagline: "Experience the thrill of Arabian desert with authentic Bedouin culture",
    highlights: [
      { icon: Sun, title: "Dune Bashing", description: "Heart-pumping 4x4 drives over golden sand dunes" },
      { icon: UtensilsCrossed, title: "BBQ Dinner", description: "Traditional Arabian BBQ under the desert stars" },
      { icon: Camera, title: "Camel Rides", description: "Scenic camel trekking across the desert landscape" },
      { icon: Music, title: "Cultural Shows", description: "Belly dance, Tanura show & fire performances" },
    ],
    stats: [
      { label: "Daily Tours", value: "50+" },
      { label: "Guest Rating", value: "4.8★" },
      { label: "Camp Options", value: "6+" },
      { label: "Years Running", value: "10+" },
    ],
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
  },
  "theme-parks": {
    tagline: "World-class theme parks with rides, attractions & family entertainment",
    highlights: [
      { icon: FerrisWheel, title: "Thrilling Rides", description: "Record-breaking roller coasters & attractions" },
      { icon: Users, title: "Family Friendly", description: "Entertainment for all ages with kids' zones" },
      { icon: Sparkles, title: "Indoor Parks", description: "Climate-controlled parks open year-round" },
      { icon: Ticket, title: "Combo Passes", description: "Save more with multi-park combo tickets" },
    ],
    stats: [
      { label: "Parks Available", value: "8+" },
      { label: "Guest Rating", value: "4.7★" },
      { label: "Attractions", value: "200+" },
      { label: "Savings Up To", value: "40%" },
    ],
    gradient: "from-rose-500/10 via-pink-500/5 to-transparent",
  },
  "water-sports": {
    tagline: "Dive into exciting aquatic adventures along Dubai's stunning coastline",
    highlights: [
      { icon: Waves, title: "Jet Skiing", description: "High-speed jet ski rides along the coast" },
      { icon: Anchor, title: "Parasailing", description: "Soar above the Arabian Gulf waters" },
      { icon: Fish, title: "Scuba Diving", description: "Explore underwater marine life & reefs" },
      { icon: Ship, title: "Flyboarding", description: "Experience the thrill of water-powered flight" },
    ],
    stats: [
      { label: "Activities", value: "15+" },
      { label: "Guest Rating", value: "4.8★" },
      { label: "Beach Locations", value: "5+" },
      { label: "Expert Guides", value: "30+" },
    ],
    gradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
  },
};

interface CategoryHighlightsProps {
  categorySlug: string;
}

const CategoryHighlights = ({ categorySlug }: CategoryHighlightsProps) => {
  const config = categoryConfigs[categorySlug];
  if (!config) return null;

  return (
    <section className={`py-8 lg:py-10 bg-gradient-to-b ${config.gradient}`}>
      <div className="container">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {config.tagline}
          </p>
        </motion.div>

        {/* Stats Strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex items-center justify-center gap-6 lg:gap-10 flex-wrap mb-8"
        >
          {config.stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-lg lg:text-xl font-extrabold text-secondary">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              {i < config.stats.length - 1 && (
                <div className="w-px h-5 bg-border/60 ml-4 hidden sm:block" />
              )}
            </div>
          ))}
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {config.highlights.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + index * 0.06 }}
              className="group flex items-start gap-3.5 p-4 rounded-2xl bg-card/60 border border-border/30 hover:border-secondary/30 hover:bg-card transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/15 transition-colors">
                <highlight.icon className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground mb-0.5">{highlight.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{highlight.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryHighlights;
