import { motion } from "framer-motion";
import { Users, Compass, DollarSign, PartyPopper, Ship, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const steps = [
  { icon: Users, title: "Create Your Group", desc: "Name your trip & set a date" },
  { icon: Compass, title: "Add Activities", desc: "Browse tours & experiences" },
  { icon: DollarSign, title: "Auto-Split Costs", desc: "Fair per-person calculation" },
  { icon: PartyPopper, title: "Share & Enjoy", desc: "One link, the whole group" },
];

const GroupTripHero = () => (
  <section className="relative bg-navy-gradient overflow-hidden">
    <div className="absolute top-[-30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] pointer-events-none" />
    <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none" />

    <div className="container max-w-5xl relative py-16 sm:py-24 lg:py-28">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center">
        <motion.div variants={itemVariants}>
          <Badge className="bg-secondary/15 text-secondary border-secondary/25 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm mb-5 inline-flex items-center gap-1.5">
            <Ship className="w-3.5 h-3.5" /> Smart Group Splitter
          </Badge>
        </motion.div>
        <motion.h1 variants={itemVariants} className="font-display text-fluid-3xl font-bold text-primary-foreground leading-tight">
          Plan Together, <span className="text-shimmer">Split Fairly</span>
        </motion.h1>
        <motion.p variants={itemVariants} className="text-primary-foreground/70 text-lg sm:text-xl mt-5 max-w-2xl mx-auto leading-relaxed">
          Create a shared trip, invite your group, add activities — costs split automatically. No sign-up required, just share a link.
        </motion.p>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-14">
        {steps.map((step, i) => (
          <motion.div key={i} variants={itemVariants} className="relative text-center group">
            <div className="w-14 h-14 rounded-xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-foreground/10 group-hover:border-secondary/30 transition-all duration-300">
              <step.icon className="w-6 h-6 text-secondary" />
            </div>
            <span className="absolute -top-1.5 left-1/2 translate-x-3 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center shadow-lg shadow-secondary/30">
              {i + 1}
            </span>
            <h3 className="font-display font-semibold text-sm text-primary-foreground">{step.title}</h3>
            <p className="text-xs text-primary-foreground/50 mt-0.5">{step.desc}</p>
            {i < steps.length - 1 && (
              <ChevronRight className="hidden lg:block absolute top-6 -right-3 w-5 h-5 text-primary-foreground/15" />
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default GroupTripHero;
