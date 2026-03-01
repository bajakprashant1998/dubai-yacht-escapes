import { motion } from "framer-motion";
import { useCarCategories } from "@/hooks/useCarCategories";
import { cn } from "@/lib/utils";
import { Car } from "lucide-react";

interface CarCategoryNavProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const CarCategoryNav = ({ selectedCategory, onCategoryChange }: CarCategoryNavProps) => {
  const { data: categories = [] } = useCarCategories();

  return (
    <motion.div
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <button
        onClick={() => onCategoryChange(null)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
          selectedCategory === null
            ? "bg-secondary text-secondary-foreground border-secondary shadow-md"
            : "bg-card/80 text-muted-foreground border-border/50 hover:bg-card hover:border-border"
        )}
      >
        <Car className="w-4 h-4" />
        All Vehicles
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.slug)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
            selectedCategory === cat.slug
              ? "bg-secondary text-secondary-foreground border-secondary shadow-md"
              : "bg-card/80 text-muted-foreground border-border/50 hover:bg-card hover:border-border"
          )}
        >
          {cat.name}
        </button>
      ))}
    </motion.div>
  );
};

export default CarCategoryNav;
