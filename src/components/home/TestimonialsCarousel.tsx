import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTestimonials, useAverageRating } from "@/hooks/useTestimonials";
import { Skeleton } from "@/components/ui/skeleton";

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const { data: testimonials = [], isLoading } = useTestimonials(6);
  const { data: ratingData } = useAverageRating();

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    if (testimonials.length === 0) return;
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let next = prevIndex + newDirection;
      if (next < 0) next = testimonials.length - 1;
      if (next >= testimonials.length) next = 0;
      return next;
    });
  };

  // Auto-advance carousel
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  if (isLoading) {
    return (
      <section className="py-20 md:py-24 bg-muted/30 overflow-hidden">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-6 w-32 mx-auto mb-3" />
            <Skeleton className="h-12 w-80 mx-auto mb-6" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </div>
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-72 w-full rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 md:py-24 bg-muted/30 overflow-hidden">
      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-secondary font-semibold tracking-widest uppercase text-sm mb-3">
            Guest Reviews
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What Our Guests Say
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
              ))}
            </div>
            <span className="font-bold text-lg text-foreground ml-1">{ratingData?.average || 4.9}</span>
            <span className="text-muted-foreground text-sm">• {ratingData?.count || 6}+ reviews</span>
          </div>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative max-w-3xl mx-auto">
          {/* Quote Icon - Floating above card */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-10">
            <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center shadow-lg">
              <Quote className="w-7 h-7 text-secondary-foreground fill-secondary-foreground" />
            </div>
          </div>

          {/* Testimonial Card */}
          <div className="bg-card rounded-2xl shadow-lg p-8 pt-12 md:p-12 md:pt-14 relative overflow-hidden min-h-[280px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="text-center"
              >
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-5">
                  {Array.from({ length: currentTestimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                  ))}
                </div>

                {/* Title / Quote */}
                {currentTestimonial.title && (
                  <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
                    "{currentTestimonial.title}"
                  </h3>
                )}

                {/* Content */}
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                  {currentTestimonial.content}
                </p>

                {/* Author */}
                <div className="flex items-center justify-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-lg font-bold text-secondary">
                    {currentTestimonial.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-foreground">{currentTestimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {currentTestimonial.location || currentTestimonial.date}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-border hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentIndex
                      ? "w-8 h-3 bg-secondary"
                      : "w-3 h-3 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-border hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all"
              onClick={() => paginate(1)}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
