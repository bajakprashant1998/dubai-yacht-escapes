import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, Car, FileText, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Building2,
    title: "Hotel Booking",
    description: "Luxury to budget hotels across Dubai with best rates guaranteed",
    link: "/hotels",
    cta: "Browse Hotels",
    gradient: "from-blue-500 to-indigo-600",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80",
  },
  {
    icon: Car,
    title: "Car Rentals",
    description: "Premium vehicles from economy to luxury with flexible plans",
    link: "/car-rentals",
    cta: "View Cars",
    gradient: "from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80",
  },
  {
    icon: FileText,
    title: "Visa Services",
    description: "Fast UAE visa processing with express options available",
    link: "/visa-services",
    cta: "Get Visa",
    gradient: "from-amber-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const QuickServices = memo(() => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-secondary font-semibold tracking-wider uppercase mb-3">
            Complete Travel Solutions
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            More Dubai Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need for a perfect Dubai trip - hotels, cars, and visas
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={item}>
              <Link to={service.link} className="block group h-full">
                <div className="relative h-full bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-60`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-secondary transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {service.description}
                    </p>
                    <Button
                      variant="ghost"
                      className="p-0 h-auto font-semibold text-secondary hover:text-secondary/80 hover:bg-transparent group/btn"
                    >
                      {service.cta}
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

QuickServices.displayName = "QuickServices";

export default QuickServices;
