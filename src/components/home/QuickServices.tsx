import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Building2, Car, FileText, ArrowRight, Star, Clock, Shield, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Building2,
    title: "Hotel Booking",
    description: "From luxury resorts to boutique hotels, find your perfect Dubai stay with exclusive rates",
    link: "/hotels",
    cta: "Browse Hotels",
    gradient: "from-blue-500 to-indigo-600",
    bgGradient: "from-blue-500/10 to-indigo-600/10",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    stats: { value: "500+", label: "Properties" },
    badges: ["Best Price", "Free Cancellation"],
  },
  {
    icon: Car,
    title: "Car Rentals",
    description: "Premium fleet from economy to supercars with flexible daily, weekly & monthly plans",
    link: "/car-rentals",
    cta: "View Cars",
    gradient: "from-emerald-500 to-teal-600",
    bgGradient: "from-emerald-500/10 to-teal-600/10",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
    stats: { value: "200+", label: "Vehicles" },
    badges: ["Self Drive", "With Driver"],
  },
  {
    icon: FileText,
    title: "Visa Services",
    description: "Fast-track UAE visa processing with express 24-hour options and 99% approval rate",
    link: "/visa-services",
    cta: "Get Visa",
    gradient: "from-amber-500 to-orange-600",
    bgGradient: "from-amber-500/10 to-orange-600/10",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
    stats: { value: "99%", label: "Success Rate" },
    badges: ["Express", "All Nationalities"],
  },
];

const features = [
  { icon: Star, text: "Verified Reviews" },
  { icon: Clock, text: "Instant Confirmation" },
  { icon: Shield, text: "Secure Payment" },
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
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm font-semibold">Complete Travel Solutions</span>
          </motion.div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            More Dubai <span className="text-secondary">Services</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Everything you need for a perfect Dubai trip - hotels, cars, and visas all in one place
          </p>
          
          {/* Trust features */}
          <div className="flex flex-wrap justify-center gap-6">
            {features.map((feature) => (
              <div key={feature.text} className="flex items-center gap-2 text-muted-foreground">
                <feature.icon className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
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
                <div className={`relative h-full bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}>
                  {/* Image with overlay */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-70 group-hover:opacity-80 transition-opacity`} />
                    
                    {/* Floating icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <service.icon className="w-10 h-10 text-white" />
                      </motion.div>
                    </div>

                    {/* Stats badge */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <span className="font-bold text-foreground">{service.stats.value}</span>
                      <span className="text-muted-foreground text-sm ml-1">{service.stats.label}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {service.badges.map((badge) => (
                        <span 
                          key={badge} 
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r ${service.bgGradient} text-foreground`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                    
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
