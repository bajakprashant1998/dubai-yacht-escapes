import { motion } from "framer-motion";
import { Shield, Clock, Heart, Users, CheckCircle2, LucideIcon } from "lucide-react";
import { useHomepageContent } from "@/hooks/useHomepageContent";

// Icon mapping for dynamic icons from database
const iconMap: Record<string, LucideIcon> = {
  Shield,
  Clock,
  Heart,
  Users,
};

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
    <section className="py-20 md:py-24 bg-primary overflow-hidden relative">
      <div className="container relative">
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            Why Book With <span className="text-secondary">Betterview Tourism</span>
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-base md:text-lg">
            We're committed to making your Dubai experience exceptional from start to finish
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {whyChooseUs.map((whyItem, index) => {
            const IconComponent = iconMap[whyItem.icon] || Shield;
            return (
              <motion.div
                key={index}
                className="text-center group"
                variants={item}
              >
                <motion.div
                  className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-2xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <IconComponent className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
                </motion.div>
                <h3 className="font-display text-base md:text-lg lg:text-xl font-semibold text-primary-foreground mb-2">
                  {whyItem.title}
                </h3>
                <p className="text-primary-foreground/60 text-sm md:text-base leading-relaxed">
                  {whyItem.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Divider */}
        <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-primary-foreground/10">
          {/* Trust Indicators */}
          <motion.div
            className="flex flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {trustIndicators.map((indicator, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <CheckCircle2 className="w-5 h-5 text-secondary" />
                <span className="font-medium text-primary-foreground text-sm md:text-base whitespace-nowrap">
                  {indicator}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
