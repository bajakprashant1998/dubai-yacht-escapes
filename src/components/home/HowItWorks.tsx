import { memo } from "react";
import { motion } from "framer-motion";
import { Search, CalendarCheck, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Discover",
    description: "Explore our curated collection of premium Dubai experiences and activities",
    number: "01",
  },
  {
    icon: CalendarCheck,
    title: "Book Instantly",
    description: "Select your date, customize your experience, and book with instant confirmation",
    number: "02",
  },
  {
    icon: Sparkles,
    title: "Enjoy Dubai",
    description: "Show up and enjoy! We handle all the details for a hassle-free experience",
    number: "03",
  },
];

const HowItWorks = memo(() => {
  return (
    <section className="py-20 bg-primary">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-secondary font-semibold tracking-wider uppercase mb-3">
            Simple & Easy
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            How It Works
          </h2>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Book your dream Dubai experience in just 3 simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-secondary/20 via-secondary to-secondary/20" />

          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="text-center">
                {/* Step number */}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-secondary/20 text-secondary font-display font-bold text-lg mb-6 relative z-10">
                  {step.number}
                </div>

                {/* Icon */}
                <motion.div
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-secondary/10 flex items-center justify-center relative"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <step.icon className="w-10 h-10 text-secondary" />
                  <div className="absolute inset-0 rounded-2xl bg-secondary/5 blur-xl" />
                </motion.div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-primary-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-primary-foreground/60 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

HowItWorks.displayName = "HowItWorks";

export default HowItWorks;
