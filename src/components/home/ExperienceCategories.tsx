import { Link } from "react-router-dom";
import { memo } from "react";
import { motion } from "framer-motion";
import { Ship, Users, Anchor, Crown, Sun, FerrisWheel, Waves, Mountain } from "lucide-react";

const experienceCategories = [
  {
    icon: Ship,
    title: "Dhow Cruises",
    description: "Traditional dining experience",
    link: "/tours?category=dhow-cruise",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-500"
  },
  {
    icon: Users,
    title: "Shared Yacht",
    description: "Live BBQ on the water",
    link: "/tours?category=yacht-shared",
    gradient: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-500"
  },
  {
    icon: Anchor,
    title: "Private Charter",
    description: "Exclusive yacht rental",
    link: "/tours?category=yacht-private",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500"
  },
  {
    icon: Crown,
    title: "Megayacht",
    description: "Premium luxury cruise",
    link: "/tours?category=megayacht",
    gradient: "from-purple-500/20 to-pink-500/20",
    iconColor: "text-purple-500"
  },
  {
    icon: Sun,
    title: "Desert Safari",
    description: "Dune bashing & BBQ",
    link: "/dubai/services/desert-safari",
    gradient: "from-amber-500/20 to-yellow-500/20",
    iconColor: "text-amber-500"
  },
  {
    icon: FerrisWheel,
    title: "Theme Parks",
    description: "World-class attractions",
    link: "/dubai/services/theme-parks",
    gradient: "from-rose-500/20 to-red-500/20",
    iconColor: "text-rose-500"
  },
  {
    icon: Waves,
    title: "Water Sports",
    description: "Jet ski & flyboard",
    link: "/dubai/services/water-sports",
    gradient: "from-sky-500/20 to-blue-500/20",
    iconColor: "text-sky-500"
  },
  {
    icon: Mountain,
    title: "Adventure",
    description: "Skydive & hot air balloon",
    link: "/dubai/services/adventure-sports",
    gradient: "from-slate-500/20 to-zinc-500/20",
    iconColor: "text-slate-500"
  },
];

const ExperienceCategories = memo(() => {
  return (
    <section className="py-6 sm:py-8 -mt-16 sm:-mt-20 relative z-20">
      <div className="container">
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 sm:gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, staggerChildren: 0.05 }}
        >
          {experienceCategories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="group block bg-card p-3 sm:p-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-border hover:border-secondary/30 relative overflow-hidden touch-target hover:-translate-y-1"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative text-center">
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-lg sm:rounded-xl bg-muted/50 flex items-center justify-center mb-2 mx-auto group-hover:scale-110 group-hover:bg-secondary/20 transition-all duration-300">
                  <category.icon className={`w-5 sm:w-6 h-5 sm:h-6 ${category.iconColor} group-hover:text-secondary transition-colors`} />
                </div>
                <h3 className="font-display font-bold text-xs sm:text-sm text-foreground mb-0.5 group-hover:text-secondary transition-colors">{category.title}</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 hidden sm:block">{category.description}</p>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

ExperienceCategories.displayName = "ExperienceCategories";

export default ExperienceCategories;
