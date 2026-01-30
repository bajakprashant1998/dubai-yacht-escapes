import { memo } from "react";
import { motion } from "framer-motion";
import { Search, CalendarCheck, Sparkles, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Discover",
    description: "Explore our curated collection of premium Dubai experiences, tours, and activities",
    number: "01",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: CalendarCheck,
    title: "Book Instantly",
    description: "Select your date, customize your experience, and get instant confirmation",
    number: "02",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Sparkles,
    title: "Enjoy Dubai",
    description: "Show up and enjoy! We handle all the details for a hassle-free experience",
    number: "03",
    color: "from-amber-500 to-orange-600",
  },
];

const HowItWorks = memo(() => {
  return (
    <section className="py-24 bg-gradient-to-b from-primary to-primary/95 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="container relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Simple & Easy</span>
          </motion.div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
            How It Works
          </h2>
          <p className="text-primary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto">
            Book your dream Dubai experience in just 3 simple steps
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Timeline connector - Desktop */}
          <div className="hidden md:block absolute top-[120px] left-[15%] right-[15%] h-1">
            <div className="w-full h-full bg-primary-foreground/10 rounded-full relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary to-secondary"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="text-center">
                  {/* Step number with animated ring */}
                  <div className="relative inline-block mb-8">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-secondary/30"
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    />
                    <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shadow-secondary/20`}>
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>
                  </div>

                  {/* Icon card */}
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 flex items-center justify-center relative group"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                    <step.icon className="w-12 h-12 text-secondary relative z-10" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="font-display text-2xl font-bold text-primary-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-primary-foreground/60 leading-relaxed max-w-xs mx-auto">
                    {step.description}
                  </p>

                  {/* Arrow for mobile */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center mt-6">
                      <ArrowRight className="w-6 h-6 text-secondary rotate-90" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

HowItWorks.displayName = "HowItWorks";

export default HowItWorks;
