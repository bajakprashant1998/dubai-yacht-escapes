import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ServiceCard from "@/components/ServiceCard";
import { useFeaturedServices } from "@/hooks/useServices";

const PopularServices = () => {
  const { data: services, isLoading } = useFeaturedServices();

  if (isLoading) {
    return (
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-96 rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-secondary">
              Dubai Experiences
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-foreground mb-4">
            Popular Activities & Tours
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Beyond yacht cruises, discover Dubai's most exciting experiences -
            from desert safaris to theme parks
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.slice(0, 4).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10">
          <Link to="/services">
            <Button
              variant="outline"
              size="lg"
              className="group border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              View All Experiences
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularServices;
