import { memo } from "react";
import { motion } from "framer-motion";
import { Search, CalendarCheck, Sparkles, ArrowDown } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Discover",
    description: "Explore our curated collection of premium Dubai experiences, tours, and activities",
    number: "01",
    gradient: "from-blue-500 to-indigo-600",
    shadowColor: "shadow-blue-500/20",
    glowColor: "bg-blue-500/20",
  },
  {
    icon: CalendarCheck,
    title: "Book Instantly",
    description: "Select your date, customize your experience, and get instant confirmation",
    number: "02",
    gradient: "from-emerald-500 to-teal-600",
    shadowColor: "shadow-emerald-500/20",
    glowColor: "bg-emerald-500/20",
  },
  {
    icon: Sparkles,
    title: "Enjoy Dubai",
    description: "Show up and enjoy! We handle all the details for a hassle-free experience",
    number: "03",
    gradient: "from-amber-500 to-orange-600",
    shadowColor: "shadow-amber-500/20",
    glowColor: "bg-amber-500/20",
  },
];

const HowItWorks = memo(() => {
  return (
    <section className="py-24 bg-gradient-to-b from-primary to-primary/95 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-secondary/3 rounded-full blur-3xl" />
      
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

        <div className="relative max-w-6xl mx-auto">
          {/* Timeline connector - Desktop */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-1 -translate-y-1/2 z-0">
            <div className="w-full h-full bg-primary-foreground/10 rounded-full relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5 }}
                style={{ transformOrigin: "left" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                className="relative z-10"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              >
                {/* Card */}
                <motion.div
                  className={`relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 lg:p-10 group hover:bg-white/10 transition-all duration-500 ${step.shadowColor} hover:shadow-2xl`}
                  whileHover={{ y: -8, borderColor: "rgba(255,255,255,0.2)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Gradient glow on hover */}
                  <div className={`absolute inset-0 rounded-3xl ${step.glowColor} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10`} />
                  
                  {/* Step number badge */}
                  <div className={`absolute -top-4 -left-4 md:top-4 md:left-4 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                    <span className="text-sm md:text-base font-bold text-white">{step.number}</span>
                  </div>

                  {/* Icon container */}
                  <div className="flex justify-center mb-6 pt-4">
                    <div className="relative">
                      {/* Gradient ring */}
                      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-300`} />
                      <div className={`absolute inset-0.5 rounded-3xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300`} />
                      <motion.div
                        className={`relative w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-br ${step.gradient} p-[2px] flex items-center justify-center`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="w-full h-full rounded-3xl bg-primary/80 backdrop-blur-sm flex items-center justify-center">
                          <step.icon className="w-12 h-12 md:w-14 md:h-14 text-white" />
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-primary-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-primary-foreground/60 leading-relaxed text-sm md:text-base">
                      {step.description}
                    </p>
                  </div>
                </motion.div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center mt-4 mb-2">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                    >
                      <ArrowDown className="w-6 h-6 text-secondary" />
                    </motion.div>
                  </div>
                )}
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
