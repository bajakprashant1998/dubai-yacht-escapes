import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Users, ShieldCheck, ArrowRight, 
  Compass, Calendar, Headphones, Star, CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const pillars = [
  {
    id: "experiences",
    icon: Compass,
    label: "Premium Experiences",
    title: "Curated by Local Experts",
    description: "Every experience is handpicked and verified by our team of Dubai experts. We partner only with top-rated operators to ensure unforgettable moments.",
    features: [
      "100+ Verified Activities",
      "Exclusive VIP Options",
      "Authentic Local Insights",
      "Best Price Guarantee"
    ],
    stats: { value: "4.9", label: "Average Rating" },
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    image: "🏜️"
  },
  {
    id: "booking",
    icon: Calendar,
    label: "Seamless Booking",
    title: "Book in 60 Seconds",
    description: "Our streamlined booking process gets you from browsing to confirmed in under a minute. Instant confirmation, flexible dates, and easy modifications.",
    features: [
      "Instant Confirmation",
      "Flexible Cancellation",
      "Mobile Tickets",
      "Real-time Availability"
    ],
    stats: { value: "60s", label: "Avg Booking Time" },
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    image: "📱"
  },
  {
    id: "support",
    icon: Headphones,
    label: "24/7 Concierge",
    title: "We're Always Here",
    description: "From pre-trip planning to on-ground support, our concierge team is available around the clock via chat, phone, or WhatsApp.",
    features: [
      "24/7 Live Support",
      "WhatsApp Assistance",
      "Multilingual Team",
      "On-Ground Help"
    ],
    stats: { value: "<2min", label: "Response Time" },
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10",
    image: "💬"
  }
];

const ValuePillars = memo(() => {
  const [activeTab, setActiveTab] = useState("experiences");
  const activePillar = pillars.find(p => p.id === activeTab) || pillars[0];

  return (
    <section className="py-24 bg-muted/30 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>
      
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-6 border border-secondary/20"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">The Betterview Difference</span>
          </motion.div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Built for{" "}
            <span className="text-secondary relative inline-block">
              Exceptional
              <motion.svg 
                className="absolute -bottom-2 left-0 w-full h-3" 
                viewBox="0 0 200 12" 
                preserveAspectRatio="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <motion.path 
                  d="M0,8 Q50,0 100,8 T200,8" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth="3" 
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </motion.svg>
            </span>
            {" "}Experiences
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl">
            Every result we deliver is powered by three connected pillars — premium experiences, seamless booking, and dedicated support.
          </p>
        </motion.div>

        {/* Pillar Tabs */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="inline-flex bg-card border rounded-2xl p-2 shadow-lg">
            {pillars.map((pillar) => (
              <button
                key={pillar.id}
                onClick={() => setActiveTab(pillar.id)}
                className={cn(
                  "relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2",
                  activeTab === pillar.id 
                    ? "text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {activeTab === pillar.id && (
                  <motion.div
                    layoutId="activePillar"
                    className={cn("absolute inset-0 rounded-xl bg-gradient-to-r", pillar.color)}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <pillar.icon className={cn(
                  "w-4 h-4 relative z-10 transition-colors",
                  activeTab === pillar.id ? "text-white" : ""
                )} />
                <span className="relative z-10 hidden sm:inline">{pillar.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left Content */}
            <div>
              <motion.div
                className={cn("inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-6", activePillar.bgColor)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <activePillar.icon className="w-4 h-4" />
                {activePillar.label}
              </motion.div>
              
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                {activePillar.title}
              </h3>
              
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                {activePillar.description}
              </p>
              
              {/* Features List */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {activePillar.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </motion.div>
                ))}
              </div>
              
              <Link to="/experiences">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2">
                  Explore Experiences
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Right Visual */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className={cn(
                "relative rounded-3xl p-8 md:p-12 border overflow-hidden",
                "bg-gradient-to-br from-card via-card to-muted/50"
              )}>
                {/* Decorative gradient */}
                <div className={cn(
                  "absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-30",
                  `bg-gradient-to-br ${activePillar.color}`
                )} />
                
                {/* Main Visual */}
                <div className="relative z-10">
                  {/* Large gradient icon instead of emoji */}
                  <motion.div 
                    className={cn(
                      "w-24 h-24 md:w-28 md:h-28 rounded-3xl flex items-center justify-center bg-gradient-to-br mb-8 shadow-xl",
                      activePillar.color
                    )}
                    animate={{ rotate: [0, 2, -2, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <activePillar.icon className="w-12 h-12 md:w-14 md:h-14 text-white" />
                  </motion.div>
                  
                  {/* Primary stat card */}
                  <motion.div 
                    className={cn(
                      "inline-flex items-center gap-4 px-6 py-4 rounded-2xl border bg-card shadow-lg"
                    )}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br",
                      activePillar.color
                    )}>
                      <Star className="w-7 h-7 text-white fill-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{activePillar.stats.value}</p>
                      <p className="text-sm text-muted-foreground">{activePillar.stats.label}</p>
                    </div>
                  </motion.div>

                  {/* Testimonial micro-quote */}
                  <motion.div
                    className="mt-6 bg-card border rounded-2xl p-4 shadow-md max-w-xs"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      "Absolutely seamless from start to finish. Best way to experience Dubai!"
                    </p>
                    <p className="text-[11px] font-medium mt-2 text-foreground">— Sarah M., London</p>
                  </motion.div>
                </div>
                
                {/* Floating elements */}
                <motion.div
                  className="absolute bottom-6 right-6 bg-card/90 backdrop-blur-sm rounded-xl px-4 py-3 border shadow-lg"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                      <Users className="w-4 h-4 text-secondary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">50,000+</p>
                      <p className="text-[10px] text-muted-foreground">Happy Travelers</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  className="absolute top-6 right-6 bg-card/90 backdrop-blur-sm rounded-xl px-3 py-2 border shadow-lg"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-secondary" />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
});

ValuePillars.displayName = "ValuePillars";

export default ValuePillars;
