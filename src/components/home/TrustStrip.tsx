import { memo, useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Star, Zap, Headphones } from "lucide-react";

interface CounterProps {
  end: number;
  suffix?: string;
  duration?: number;
  isDecimal?: boolean;
}

const AnimatedNumber = ({ end, suffix = "", duration = 2, isDecimal = false }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(easeOut * end);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);
  
  const formatNumber = (num: number) => {
    if (isDecimal) return num.toFixed(1);
    if (num >= 1000) return Math.floor(num / 1000) + "K";
    return Math.floor(num).toString();
  };
  
  return <span ref={ref}>{formatNumber(count)}{suffix}</span>;
};

const trustItems = [
  {
    icon: Users,
    value: 50000,
    suffix: "+",
    label: "Happy Travelers",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "★",
    label: "Average Rating",
    isDecimal: true,
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: Zap,
    value: 100,
    suffix: "+",
    label: "Activities",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Headphones,
    value: 24,
    suffix: "/7",
    label: "Support",
    color: "from-purple-500 to-pink-600",
  },
];

const TrustStrip = memo(() => {
  return (
    <section className="relative bg-gradient-to-r from-primary via-primary to-primary py-6 border-y border-primary-foreground/10 overflow-hidden z-30">
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-secondary/5"
        animate={{ 
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="container relative z-10">
        <motion.div 
          className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 group cursor-default"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Icon with gradient background */}
              <motion.div 
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.3 }}
              >
                <item.icon className="w-6 h-6 text-white" />
              </motion.div>
              
              <div className="flex flex-col">
                <span className="font-bold text-2xl md:text-3xl text-primary-foreground leading-tight tracking-tight">
                  {item.isDecimal ? (
                    <AnimatedNumber end={item.value as number} suffix={item.suffix} isDecimal />
                  ) : (
                    <AnimatedNumber end={item.value as number} suffix={item.suffix} />
                  )}
                </span>
                <span className="text-sm text-primary-foreground/70 font-medium">{item.label}</span>
              </div>
            </motion.div>
          ))}
          
          {/* Live indicator */}
          <motion.div 
            className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary/20 border border-secondary/30"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div 
              className="w-2.5 h-2.5 rounded-full bg-secondary"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-sm font-semibold text-secondary">Live Bookings</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
});

TrustStrip.displayName = "TrustStrip";

export default TrustStrip;
