import { memo } from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp, Users, Award, Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const results = [
  {
    type: "stat",
    icon: TrendingUp,
    value: "98%",
    label: "Customer Satisfaction",
    description: "Based on post-trip surveys",
    color: "from-blue-500 to-indigo-600",
  },
  {
    type: "testimonial",
    quote: "The desert safari was absolutely magical! From pickup to drop-off, everything was perfectly organized. The sunset views were breathtaking.",
    author: "Sarah M.",
    location: "United Kingdom",
    rating: 5,
    experience: "Desert Safari",
  },
  {
    type: "stat",
    icon: Users,
    value: "50K+",
    label: "Happy Travelers",
    description: "And counting every day",
    color: "from-emerald-500 to-teal-600",
  },
  {
    type: "testimonial",
    quote: "Best yacht experience in Dubai! The crew was amazing and the views of the Marina were spectacular. Will definitely book again.",
    author: "Ahmed K.",
    location: "UAE",
    rating: 5,
    experience: "Yacht Cruise",
  },
  {
    type: "stat",
    icon: Award,
    value: "#1",
    label: "Rated Platform",
    description: "On TripAdvisor & Google",
    color: "from-amber-500 to-orange-600",
  },
  {
    type: "testimonial",
    quote: "Incredible service from start to finish. They helped plan our entire Dubai trip and every activity was better than expected!",
    author: "Maria L.",
    location: "Spain",
    rating: 5,
    experience: "Full Dubai Tour",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const ResultsShowcase = memo(() => {
  return (
    <section className="py-24 bg-primary overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-2 rounded-full mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Star className="w-4 h-4 fill-secondary" />
            <span className="text-sm font-semibold">Proven Results</span>
          </motion.div>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
            Stories of{" "}
            <span className="text-secondary">Unforgettable</span>
            {" "}Moments
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto text-lg md:text-xl">
            See why thousands of travelers choose us for their Dubai adventures
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
        >
          {results.map((result, index) => (
            <motion.div
              key={index}
              variants={item}
              className={cn(
                "group relative rounded-2xl border border-primary-foreground/10 overflow-hidden",
                "bg-primary-foreground/5 backdrop-blur-sm",
                "hover:bg-primary-foreground/10 hover:border-primary-foreground/20",
                "transition-all duration-300"
              )}
            >
              {result.type === "stat" ? (
                // Stat Card
                <div className="p-8 text-center">
                  <motion.div
                    className={cn(
                      "w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center",
                      "bg-gradient-to-br shadow-lg",
                      result.color
                    )}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <result.icon className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <motion.p 
                    className="text-5xl md:text-6xl font-bold text-secondary mb-2"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    {result.value}
                  </motion.p>
                  <h3 className="text-xl font-bold text-primary-foreground mb-1">
                    {result.label}
                  </h3>
                  <p className="text-sm text-primary-foreground/60">
                    {result.description}
                  </p>
                </div>
              ) : (
                // Testimonial Card
                <div className="p-8">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: result.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-secondary fill-secondary" />
                    ))}
                  </div>
                  
                  <Quote className="w-8 h-8 text-secondary/30 mb-4" />
                  
                  <p className="text-primary-foreground/90 mb-6 leading-relaxed">
                    "{result.quote}"
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-primary-foreground">{result.author}</p>
                      <p className="text-sm text-primary-foreground/60">{result.location}</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-full bg-secondary/20 text-secondary text-xs font-medium">
                      {result.experience}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <Link to="/experiences">
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2 h-14 px-8 text-lg"
            >
              Start Your Adventure
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
});

ResultsShowcase.displayName = "ResultsShowcase";

export default ResultsShowcase;
