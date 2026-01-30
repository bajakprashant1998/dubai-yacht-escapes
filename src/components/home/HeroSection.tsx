import { Link } from "react-router-dom";
import { memo, useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, type Easing } from "framer-motion";
import { ArrowRight, Play, Sparkles, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import HeroSearchBar from "./HeroSearchBar";
import heroBurjKhalifa from "@/assets/hero-burj-khalifa.webp";

const easeOut: Easing = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: easeOut }
  }
};

const HeroSection = memo(() => {
  const { stats } = useHomepageContent();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const contentY = useTransform(scrollY, [0, 500], [0, 50]);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Intersection Observer to pause video when not visible
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [videoLoaded]);

  const showVideo = !prefersReducedMotion && !videoError;

  const statsDisplay = [
    { value: stats.guests, label: stats.guestsLabel },
    { value: stats.rating, label: stats.ratingLabel },
    { value: stats.experience, label: stats.experienceLabel },
    { value: stats.support, label: stats.supportLabel },
  ];

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden">
      {/* Background Video/Image with Parallax */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        {/* Video Background */}
        {showVideo && (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={heroBurjKhalifa}
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            className={`absolute inset-0 w-full h-full object-cover scale-110 transition-opacity duration-1000 ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src="/assets/dubai-hero-video.mp4" type="video/mp4" />
          </video>
        )}
        
        {/* Fallback Image (shows while video loads or if video fails) */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${
          showVideo && videoLoaded ? "opacity-0" : "opacity-100"
        }`}>
          <OptimizedImage
            src={heroBurjKhalifa}
            alt="Dubai experiences and adventures with Burj Khalifa"
            priority
            objectFit="cover"
            sizes="100vw"
            onLoad={() => setImageLoaded(true)}
            containerClassName="w-full h-full scale-110"
          />
        </div>
        
        {/* Overlay gradients for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/55 to-primary/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent" />
      </motion.div>

      {/* Animated Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-[15%] w-80 h-80 bg-secondary/15 rounded-full blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-32 left-[8%] w-64 h-64 bg-secondary/10 rounded-full blur-2xl"
          animate={{
            y: [0, 25, 0],
            x: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 right-[30%] w-40 h-40 bg-secondary/8 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      {/* Content with Parallax */}
      <motion.div className="container relative z-10 py-20" style={{ y: contentY }}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="text-primary-foreground"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm text-secondary px-4 py-2 rounded-full mb-6 border border-secondary/30"
              variants={itemVariants}
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
              <span className="text-sm font-semibold">Dubai's Premier Experiences Marketplace</span>
            </motion.div>

            <motion.h1 
              className="font-display text-fluid-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] mb-4"
              variants={itemVariants}
            >
              Discover Dubai's
              <motion.span 
                className="block text-shimmer mt-2"
                animate={{ 
                  backgroundPosition: ["200% 0", "-200% 0"] 
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                Best Adventures
              </motion.span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl text-primary-foreground/90 mb-6 leading-relaxed max-w-xl"
              variants={itemVariants}
            >
              Book unforgettable experiences including desert safaris, theme parks, water sports, dhow cruises, and 100+ activities across Dubai.
            </motion.p>

            {/* Search Bar */}
            <motion.div className="mb-8" variants={itemVariants}>
              <HeroSearchBar />
            </motion.div>

            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12"
              variants={itemVariants}
            >
              <Link to="/experiences" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button size="lg" className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 shadow-lg hover:shadow-xl transition-all duration-300 group touch-target">
                    Explore Experiences
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/experiences" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 backdrop-blur-sm touch-target">
                    <Play className="w-5 h-5 mr-2" />
                    View All Activities
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
              variants={itemVariants}
            >
              {statsDisplay.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center bg-primary-foreground/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-primary-foreground/10 cursor-default"
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5,
                    backgroundColor: "rgba(255,255,255,0.1)"
                  }}
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

          {/* Right Side - Floating Card */}
          <motion.div 
            className="hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <motion.div 
              className="relative"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div 
                className="bg-card/95 backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-border/50 max-w-sm ml-auto"
                whileHover={{ 
                  scale: 1.02,
                  rotateY: 5,
                  rotateX: -2,
                }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Compass className="w-6 h-6 text-secondary" />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-foreground">Find Your Adventure</p>
                    <p className="text-sm text-muted-foreground">100+ experiences available</p>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  {[
                    "Desert safaris & dune bashing",
                    "Theme parks & attractions",
                    "Water sports & yacht cruises"
                  ].map((item, idx) => (
                    <motion.div 
                      key={idx}
                      className="flex items-center gap-2 text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + idx * 0.15 }}
                    >
                      <motion.span 
                        className="w-2 h-2 rounded-full bg-secondary"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                      />
                      <span className="text-muted-foreground">{item}</span>
                    </motion.div>
                  ))}
                </div>
                <Link to="/experiences">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      Browse All Experiences
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-8 h-12 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
            <motion.div 
              className="w-1.5 h-3 bg-secondary rounded-full"
              animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";

export default HeroSection;
