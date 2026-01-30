import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCarRental } from "@/hooks/useCarRentals";
import CarBookingModal from "@/components/car-rentals/CarBookingModal";
import CarPricingTable from "@/components/car-rentals/CarPricingTable";
import CarSpecifications from "@/components/car-rentals/CarSpecifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Check, MessageCircle } from "lucide-react";
import { useContactConfig } from "@/hooks/useContactConfig";

const CarRentalDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: car, isLoading, error } = useCarRental(slug || "");
  const { whatsapp } = useContactConfig();
  const [bookingOpen, setBookingOpen] = useState(false);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16">
          <div className="container max-w-5xl">
            <Skeleton className="h-8 w-48 mb-8" />
            <Skeleton className="aspect-video w-full rounded-xl mb-8" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error || !car) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Car Not Found</h1>
            <Link to="/car-rentals">
              <Button>Back to Car Rentals</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-16">
        <div className="container max-w-5xl">
          {/* Breadcrumb */}
          <Link
            to="/car-rentals"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Car Rentals
          </Link>
          
          {/* Main Image */}
          <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
            <img
              src={car.image_url || "/placeholder.svg"}
              alt={car.title}
              className="w-full h-full object-cover"
            />
            {car.is_featured && (
              <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                Featured
              </Badge>
            )}
          </div>
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{car.title}</h1>
              <p className="text-muted-foreground">
                {car.brand} {car.model} • {car.year}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-secondary">
                AED {car.daily_price}
              </div>
              <p className="text-muted-foreground">per day</p>
            </div>
          </div>
          
          {/* Specifications */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Specifications</h2>
            <CarSpecifications car={car} />
          </section>
          
          {/* Pricing */}
          <section className="mb-12" id="book">
            <h2 className="text-xl font-semibold mb-4">Rental Options</h2>
            <CarPricingTable car={car} />
          </section>
          
          {/* Features */}
          {car.features.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {car.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Requirements */}
          {car.requirements.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Rental Requirements</h2>
              <ul className="space-y-2">
                {car.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          
          {/* Description */}
          {car.long_description && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <div className="prose prose-muted max-w-none">
                {car.long_description}
              </div>
            </section>
          )}
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center sticky bottom-4 bg-background p-4 rounded-xl shadow-lg border">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={() => setBookingOpen(true)}
            >
              Book This Car
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
              onClick={() => {
                const message = encodeURIComponent(`Hi! I'm interested in renting the ${car.title}`);
                window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
              }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp Enquiry
            </Button>
          </div>
        </div>
      </div>
      
      <CarBookingModal
        car={car}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </Layout>
  );
};

export default CarRentalDetail;