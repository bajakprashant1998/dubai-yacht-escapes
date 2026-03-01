import { motion } from "framer-motion";
import { Shield, Clock, MapPin, Star, Headphones, CarFront } from "lucide-react";

const stats = [
  { icon: CarFront, value: "200+", label: "Premium Vehicles" },
  { icon: Star, value: "4.9★", label: "Customer Rating" },
  { icon: Clock, value: "24/7", label: "Support Available" },
  { icon: Shield, value: "100%", label: "Insured Fleet" },
];

const CarHeroStats = () => {
  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            className="flex items-center gap-3 bg-primary-foreground/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-primary-foreground/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
          >
            <div className="w-9 h-9 rounded-lg bg-secondary/20 flex items-center justify-center shrink-0">
              <Icon className="w-4.5 h-4.5 text-secondary" />
            </div>
            <div>
              <p className="text-sm font-bold text-primary-foreground">{stat.value}</p>
              <p className="text-xs text-primary-foreground/60">{stat.label}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default CarHeroStats;
