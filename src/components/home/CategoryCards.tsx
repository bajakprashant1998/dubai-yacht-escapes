import { Link } from "react-router-dom";
import { memo } from "react";
import { motion } from "framer-motion";
import { categoryCardsData } from "./HeroSection";

const CategoryCards = memo(() => {
  return (
    <section className="py-6 sm:py-8">
      <div className="container mx-auto px-3 md:px-4">
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-1.5 sm:gap-2 md:gap-3">
          {categoryCardsData.map((item, index) => (
            <Link key={item.label} to={`/experiences?category=${item.slug}`} className="block h-full">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.05, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)" }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg cursor-pointer h-full min-h-[90px] sm:min-h-[110px] md:min-h-[140px] group"
              >
                <div className="absolute inset-0">
                  <img src={item.image} alt={item.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                </div>
                <div className={`absolute inset-0 bg-gradient-to-t ${item.overlay}`} />
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-2 sm:p-3 md:p-4 text-center">
                  <motion.div
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1.5 sm:mb-2 md:mb-3 border border-white/30"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </motion.div>
                  <h3 className="text-[9px] sm:text-[10px] md:text-sm font-bold text-white leading-tight drop-shadow-md">{item.label}</h3>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

CategoryCards.displayName = "CategoryCards";
export default CategoryCards;
