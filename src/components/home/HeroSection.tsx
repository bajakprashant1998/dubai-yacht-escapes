import { Link } from "react-router-dom";
import { memo, useState, useEffect } from "react";
import { motion, type Easing } from "framer-motion";
import { ArrowRight, Play, Sparkles, TrendingUp, Sun, Waves, Ship, Mountain, MapPin, Eye, Utensils, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import HeroSearchBar from "./HeroSearchBar";
import heroImage from "@/assets/hero-dubai-skyline.png";

// Category images
import desertSafariImg from "@/assets/services/desert-safari.jpg";
import themeParksImg from "@/assets/services/theme-parks.jpg";
import waterSportsImg from "@/assets/services/water-sports.jpg";
import cityToursImg from "@/assets/services/city-tours.jpg";
import adventureImg from "@/assets/services/adventure-sports.jpg";
import observationImg from "@/assets/services/observation-decks.jpg";
import diningImg from "@/assets/services/dining-experiences.jpg";
import dhowCruiseImg from "@/assets/tours/dhow-cruise-marina.webp";

const easeOut: Easing = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const LiveRevenueCounter = memo(() => {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <div className="relative flex items-center gap-1.5">
        <motion.div className="w-2 h-2 rounded-full bg-secondary" animate={pulse ? { scale: [1, 1.5, 1] } : {}} />
        <motion.div className="absolute w-2 h-2 rounded-full bg-secondary" animate={{ scale: [1, 2.5], opacity: [0.6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
      </div>
      <TrendingUp className="w-3.5 h-3.5 text-secondary" />
      <span className="text-xs font-medium">
        <span className="font-bold text-orange-100">AED 10M+</span> in experiences booked
      </span>
    </motion.div>
  );
});
LiveRevenueCounter.displayName = "LiveRevenueCounter";

const categoryCardsData = [
  { icon: Sun, label: "Desert Safari", image: desertSafariImg, overlay: "from-amber-600/80 to-orange-500/60", slug: "desert-safari" },
  { icon: Ticket, label: "Theme Parks", image: themeParksImg, overlay: "from-rose-600/80 to-pink-500/60", slug: "theme-parks" },
  { icon: Waves, label: "Water Sports", image: waterSportsImg, overlay: "from-cyan-600/80 to-blue-500/60", slug: "water-sports" },
  { icon: Ship, label: "Cruises", image: dhowCruiseImg, overlay: "from-blue-600/80 to-indigo-500/60", slug: "sightseeing-cruises" },
  { icon: Mountain, label: "Adventure", image: adventureImg, overlay: "from-violet-600/80 to-purple-500/60", slug: "adventure-sports" },
  { icon: MapPin, label: "City Tours", image: cityToursImg, overlay: "from-orange-600/80 to-amber-500/60", slug: "city-tours" },
  { icon: Eye, label: "Observation", image: observationImg, overlay: "from-emerald-600/80 to-teal-500/60", slug: "observation-decks" },
  { icon: Utensils, label: "Dining", image: diningImg, overlay: "from-pink-600/80 to-rose-500/60", slug: "dining-experiences" },
];

const HeroSection = memo(() => {
  const { stats } = useHomepageContent();

  const statsDisplay = [
    { value: stats.guests, label: stats.guestsLabel },
    { value: stats.rating, label: stats.ratingLabel },
    { value: stats.experience, label: stats.experienceLabel },
    { value: stats.support, label: stats.supportLabel },
  ];

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Cinematic background with slow pan + zoom animation */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        animate={{
          scale: [1, 1.08, 1.04, 1.1],
          x: ["0%", "2%", "-1%", "1%"],
          y: ["0%", "-1%", "1%", "-0.5%"],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        <img
          src={heroImage}
          alt="Dubai skyline with Burj Khalifa at sunset evening view"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transformOrigin: "center center" }}
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-primary/10" />

      {/* Slow light sweep */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/5 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
        style={{ width: "200%" }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-[15%] w-96 h-96 bg-gradient-radial from-amber-400/20 via-orange-500/10 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, -40, 0], x: [0, 20, 0], scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-[8%] w-72 h-72 bg-gradient-radial from-purple-500/15 via-violet-600/8 to-transparent rounded-full blur-2xl"
          animate={{ y: [0, 30, 0], x: [0, -15, 0], scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-[30%] left-[20%] w-2 h-2 bg-secondary/60 rounded-full"
          animate={{ y: [0, -20, 0], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[60%] right-[35%] w-3 h-3 bg-amber-300/50 rounded-full"
          animate={{ y: [0, -30, 0], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
      </div>

      {/* Main content area */}
      <div className="container relative z-10 flex-1 flex items-center py-24 sm:py-28 md:py-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto w-full">
          <motion.div className="text-primary-foreground" variants={containerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} className="mb-4">
              <LiveRevenueCounter />
            </motion.div>

            <motion.div
              className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full mb-6 border border-secondary/30"
              variants={itemVariants}
            >
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span className="text-sm font-semibold text-primary-foreground">Dubai's Premier Experiences Marketplace</span>
            </motion.div>

            <motion.h1 className="font-display text-fluid-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-4" variants={itemVariants}>
              Discover Dubai's
              <motion.span
                className="block text-shimmer mt-2"
                animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                Best Adventures
              </motion.span>
            </motion.h1>

            <motion.p className="text-lg md:text-xl text-primary-foreground/90 mb-6 leading-relaxed max-w-2xl mx-auto" variants={itemVariants}>
              Book unforgettable experiences including desert safaris, theme parks, water sports, dhow cruises, and 100+ activities across Dubai.
            </motion.p>

            <motion.div className="mb-8 w-full flex justify-center" variants={itemVariants}>
              <HeroSearchBar />
            </motion.div>

            <motion.div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 justify-center" variants={itemVariants}>
              <Link to="/experiences" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 shadow-lg hover:shadow-xl transition-all duration-300 group touch-target">
                    Explore Experiences
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/experiences" className="w-full sm:w-auto">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-secondary/50 text-secondary bg-secondary/10 hover:bg-secondary/20 font-semibold text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 backdrop-blur-sm touch-target">
                    <Play className="w-5 h-5 mr-2 fill-secondary" />
                    View All Activities
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full" variants={itemVariants}>
              {statsDisplay.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center bg-primary-foreground/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-primary-foreground/10 cursor-default"
                  whileHover={{ scale: 1.05, y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.p
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-[10px] sm:text-xs text-primary-foreground/70 uppercase tracking-wider mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Category Cards - inside hero, at the bottom */}
      <div className="relative z-10 pb-8 sm:pb-10 md:pb-12">
        <div className="container mx-auto px-3 md:px-4">
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-1.5 sm:gap-2 md:gap-3">
            {categoryCardsData.map((item, index) => (
              <Link key={item.label} to={`/experiences?category=${item.slug}`} className="block h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.06, duration: 0.5, ease: easeOut }}
                  whileHover={{ y: -8, scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)" }}
                  whileTap={{ scale: 0.98 }}
                  className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg cursor-pointer h-full min-h-[100px] sm:min-h-[120px] md:min-h-[150px] group"
                >
                  <div className="absolute inset-0">
                    <img src={item.image} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-t ${item.overlay}`} />
                  <div className="relative z-10 h-full flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 text-center">
                    <motion.div
                      className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1.5 sm:mb-2 md:mb-3 border border-white/30"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                    </motion.div>
                    <h3 className="text-[10px] sm:text-xs md:text-sm font-bold text-white leading-tight drop-shadow-md">{item.label}</h3>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
export default HeroSection;
