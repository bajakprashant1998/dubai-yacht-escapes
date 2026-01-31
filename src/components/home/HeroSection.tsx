import { Link } from "react-router-dom";
import { memo, useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, type Easing } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import HeroSearchBar from "./HeroSearchBar";
import heroBurjKhalifaEvening from "@/assets/hero-burj-khalifa-evening.webp";

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
            poster={heroBurjKhalifaEvening}
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <source src="/assets/dubai-hero-video.mp4" type="video/mp4" />
          </video>
        )}
        
        {/* Fallback Image with Ken Burns effect */}
        <motion.div 
          className={`absolute inset-0 transition-opacity duration-1000 ${
            showVideo && videoLoaded ? "opacity-0" : "opacity-100"
          }`}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
        >
          <OptimizedImage
            src={heroBurjKhalifaEvening}
            alt="Dubai skyline with Burj Khalifa at sunset evening view"
            priority
            objectFit="cover"
            sizes="100vw"
            onLoad={() => setImageLoaded(true)}
            containerClassName="w-full h-full"
          />
        </motion.div>
        
        {/* Evening-themed gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />
        
        {/* Animated gradient sweep effect */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-secondary/10 via-transparent to-secondary/5"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Animated Floating Light Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Golden orb - top right */}
        <motion.div
          className="absolute top-20 right-[15%] w-96 h-96 bg-gradient-radial from-amber-400/20 via-orange-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            y: [0, -40, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Purple glow - bottom left */}
        <motion.div
          className="absolute bottom-32 left-[8%] w-72 h-72 bg-gradient-radial from-purple-500/15 via-violet-600/8 to-transparent rounded-full blur-2xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        
        {/* Warm accent - center right */}
        <motion.div
          className="absolute top-1/2 right-[25%] w-48 h-48 bg-gradient-radial from-orange-400/15 via-amber-500/8 to-transparent rounded-full blur-xl"
          animate={{
            y: [0, -25, 0],
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        {/* Small floating sparkles */}
        <motion.div
          className="absolute top-[30%] left-[20%] w-2 h-2 bg-secondary/60 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-[60%] right-[35%] w-3 h-3 bg-amber-300/50 rounded-full"
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div
          className="absolute top-[45%] left-[60%] w-2 h-2 bg-white/40 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        />
      </div>

      {/* Content with Parallax */}
      <motion.div className="container relative z-10 py-20" style={{ y: contentY }}>
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
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
              className="text-lg md:text-xl text-primary-foreground/90 mb-6 leading-relaxed max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Book unforgettable experiences including desert safaris, theme parks, water sports, dhow cruises, and 100+ activities across Dubai.
            </motion.p>

            {/* Search Bar */}
            <motion.div className="mb-8 w-full flex justify-center" variants={itemVariants}>
              <HeroSearchBar />
            </motion.div>

            {/* CTAs */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12 justify-center"
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
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-secondary/50 text-secondary bg-secondary/10 hover:bg-secondary/20 font-semibold text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 backdrop-blur-sm touch-target">
                    <Play className="w-5 h-5 mr-2 fill-secondary" />
                    View All Activities
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats Row */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full"
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
