import { memo, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Star, Clock, Ship, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { useFeaturedTours } from "@/hooks/useTours";
import { Tour } from "@/lib/tourMapper";
import { getTourUrl } from "@/lib/seoUtils";
import useEmblaCarousel from "embla-carousel-react";

const categoryLabels: Record<string, string> = {
  "dhow-cruise": "Dhow Cruise",
  "yacht-shared": "Shared Yacht",
  "yacht-private": "Private Charter",
  "megayacht": "Megayacht",
};

const CarouselSlide = ({ tour }: { tour: Tour }) => {
  const discount = Math.round((1 - tour.price / tour.originalPrice) * 100);
  const isPrivateCharter = tour.fullYachtPrice && tour.fullYachtPrice > 0;

  return (
    <Link to={getTourUrl(tour)} className="group block h-full">
      <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
        <div className="relative overflow-hidden">
          <OptimizedImage
            src={tour.image}
            alt={tour.title}
            aspectRatio="16/10"
            sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className="group-hover:scale-105 transition-transform duration-700"
          />
          {discount > 0 && (
            <div className="absolute top-4 left-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold z-10">
              {discount}% OFF
            </div>
          )}
          {isPrivateCharter && (
            <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10 shadow-lg">
              <Ship className="w-3 h-3" />
              Private
            </div>
          )}
          <div className="absolute bottom-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 z-10">
            <Ship className="w-3 h-3" />
            {categoryLabels[tour.category] || tour.category}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <p className="text-secondary text-sm font-medium mb-1">{tour.subtitle}</p>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors line-clamp-2">
            {tour.title}
          </h3>
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{tour.description}</p>

          <div className="flex items-center gap-3 mb-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="font-medium">{tour.rating}</span>
              <span className="text-muted-foreground">({tour.reviewCount.toLocaleString()})</span>
            </div>
          </div>

          <div className="flex items-end justify-between pt-3 border-t border-border mt-auto">
            <div>
              {isPrivateCharter ? (
                <>
                  <span className="text-xl font-bold text-foreground">AED {tour.fullYachtPrice!.toLocaleString()}</span>
                  <p className="text-secondary text-xs font-medium flex items-center gap-1">
                    <Ship className="w-3 h-3" /> Per Hour
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-foreground">AED {tour.price.toLocaleString()}</span>
                    {tour.originalPrice > tour.price && (
                      <span className="text-muted-foreground line-through text-sm">AED {tour.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-xs flex items-center gap-1">
                    <Ticket className="w-3 h-3" />
                    {tour.pricingType === "per_hour" ? "per hour" : "per person"}
                  </p>
                </>
              )}
            </div>
            <Button variant="ghost" size="sm" className="text-secondary hover:text-secondary hover:bg-secondary/10 font-semibold">
              Details <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

const FeaturedToursCarousel = memo(() => {
  const { data: tours = [], isLoading } = useFeaturedTours();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    // Auto-scroll every 5 seconds
    const autoplay = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, 5000);

    return () => {
      clearInterval(autoplay);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24">
        <div className="container">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[420px] rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!tours.length) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <p className="text-secondary font-semibold tracking-wider uppercase mb-3">Popular Experiences</p>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Featured Tours
            </h2>
          </div>
          <div className="flex items-center gap-3 mt-6 md:mt-0">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <Link to="/tours">
              <Button variant="outline" size="lg" className="font-semibold group ml-2">
                View All
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {tours.map((tour) => (
              <div key={tour.id} className="flex-[0_0_85%] sm:flex-[0_0_48%] lg:flex-[0_0_32%] min-w-0">
                <CarouselSlide tour={tour} />
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {tours.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === selectedIndex ? "w-6 bg-secondary" : "w-2 bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

FeaturedToursCarousel.displayName = "FeaturedToursCarousel";

export default FeaturedToursCarousel;
