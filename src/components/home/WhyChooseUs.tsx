import { motion } from "framer-motion";
import { Shield, Clock, Heart, Users, CheckCircle2, LucideIcon, Award, Star, Headphones, CreditCard } from "lucide-react";
import { useHomepageContent } from "@/hooks/useHomepageContent";

// Icon mapping for dynamic icons from database
const iconMap: Record<string, LucideIcon> = {
  Shield,
  Clock,
  Heart,
  Users,
  Award,
  Star,
  Headphones,
  CreditCard,
};

const gradients = [
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-purple-500 to-pink-600",
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const WhyChooseUs = () => {
  const { whyChooseUs, trustIndicators } = useHomepageContent();

  return (
    <section className="py-24 bg-gradient-to-b from-primary to-primary/95 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
      
      <div className="container relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Award className="w-4 h-4" />
            <span className="text-sm font-semibold">Trusted by 10,000+ Travelers</span>
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
            Why Book With{" "}
            <span className="text-secondary relative">
              Betterview
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-secondary/30" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M0,8 Q50,0 100,8 T200,8" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg md:text-xl">
            We're committed to making your Dubai experience exceptional from start to finish
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {whyChooseUs.map((whyItem, index) => {
            const IconComponent = iconMap[whyItem.icon] || Shield;
            const gradient = gradients[index % gradients.length];
            return (
              <motion.div
                key={index}
                className="group"
                variants={item}
              >
                <div className="h-full bg-primary-foreground/5 backdrop-blur-sm rounded-2xl border border-primary-foreground/10 p-6 md:p-8 text-center hover:bg-primary-foreground/10 transition-all duration-300">
                  {/* Icon with gradient background */}
                  <motion.div
                    className="relative w-20 h-20 mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                    <div className="absolute inset-0 rounded-2xl bg-secondary/20 flex items-center justify-center">
                      <IconComponent className="w-10 h-10 text-secondary" />
                    </div>
                  </motion.div>
                  
                  <h3 className="font-display text-lg md:text-xl font-bold text-primary-foreground mb-3">
                    {whyItem.title}
                  </h3>
                  <p className="text-primary-foreground/60 text-sm md:text-base leading-relaxed">
                    {whyItem.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust Indicators Strip */}
        <motion.div
          className="mt-16 pt-12 border-t border-primary-foreground/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 lg:gap-16">
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 bg-primary-foreground/5 px-5 py-3 rounded-full"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                <span className="font-semibold text-primary-foreground text-sm md:text-base whitespace-nowrap">
                  {indicator}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
