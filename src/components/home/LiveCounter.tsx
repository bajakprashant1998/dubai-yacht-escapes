import { memo, useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

const AnimatedCounter = ({ end, duration = 2, suffix = "", prefix = "", decimals = 0 }: CounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      
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
    if (num >= 1000000) {
      return (num / 1000000).toFixed(decimals) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(decimals) + "K";
    }
    return num.toLocaleString();
  };
  
  return (
    <span ref={ref}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

const LiveCounter = memo(() => {
  const [pulse, setPulse] = useState(false);
  
  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Live indicator */}
      <div className="relative">
        <motion.div 
          className="w-2.5 h-2.5 rounded-full bg-secondary"
          animate={pulse ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}}
          transition={{ duration: 0.5 }}
        />
        <motion.div 
          className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-secondary"
          animate={{ scale: [1, 2], opacity: [0.5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      
      {/* Counter */}
      <div className="flex items-center gap-2 text-sm font-semibold text-primary-foreground">
        <TrendingUp className="w-4 h-4 text-secondary" />
        <span className="text-secondary">
          <AnimatedCounter end={2850000} suffix="+" prefix="AED " decimals={1} duration={2.5} />
        </span>
        <span className="text-primary-foreground/70">experiences booked</span>
      </div>
    </motion.div>
  );
});

LiveCounter.displayName = "LiveCounter";

export default LiveCounter;
