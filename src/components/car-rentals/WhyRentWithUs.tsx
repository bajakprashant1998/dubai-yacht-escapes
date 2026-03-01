import { motion } from "framer-motion";
import { Shield, Clock, MapPin, CreditCard, Headphones, CarFront } from "lucide-react";

const reasons = [
  {
    icon: Shield,
    title: "Fully Insured",
    description: "Comprehensive insurance coverage on every rental for your peace of mind.",
  },
  {
    icon: MapPin,
    title: "Free Delivery",
    description: "Complimentary delivery and pickup across Dubai, including airports and hotels.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Multiple payment options including credit cards, bank transfers, and cash.",
  },
  {
    icon: Clock,
    title: "No Hidden Fees",
    description: "Transparent pricing with no surprise charges. What you see is what you pay.",
  },
  {
    icon: Headphones,
    title: "24/7 Roadside Assist",
    description: "Round-the-clock support and emergency roadside assistance throughout Dubai.",
  },
  {
    icon: CarFront,
    title: "Well-Maintained Fleet",
    description: "All vehicles undergo rigorous inspections and are maintained to the highest standards.",
  },
];

const WhyRentWithUs = () => {
  return (
    <section className="py-16 bg-card border-t border-border/50">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
            Rent with Confidence
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Experience premium car rental with unmatched service quality across Dubai.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, i) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.title}
                className="flex gap-4 p-5 rounded-2xl bg-muted/30 border border-border/50 hover:border-secondary/30 hover:bg-muted/50 transition-all group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <Icon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{reason.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyRentWithUs;
