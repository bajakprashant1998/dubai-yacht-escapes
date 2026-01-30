import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useCarRental, useCarRentals } from "@/hooks/useCarRentals";
import CarBookingModal from "@/components/car-rentals/CarBookingModal";
import CarBookingCard from "@/components/car-rentals/CarBookingCard";
import CarSpecifications from "@/components/car-rentals/CarSpecifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  ChevronLeft, 
  Check, 
  Users, 
  Fuel, 
  Gauge, 
  Calendar,
  Star,
  ChevronRight
} from "lucide-react";
import { useContactConfig } from "@/hooks/useContactConfig";

const faqs = [
  {
    question: "What documents do I need to rent a car?",
    answer: "You'll need a valid driver's license (international license for tourists), passport, and a credit card for the security deposit. UAE residents need their Emirates ID and valid UAE driving license."
  },
  {
    question: "Is insurance included in the rental price?",
    answer: "Basic insurance coverage is included with all rentals. Comprehensive insurance with zero deductible is available as an add-on for additional peace of mind."
  },
  {
    question: "Can I extend my rental period?",
    answer: "Yes! You can extend your rental by contacting us at least 24 hours before your return date. Extensions are subject to availability and the applicable daily rate."
  },
  {
    question: "What is the fuel policy?",
    answer: "All vehicles are provided with a full tank of fuel. Please return the vehicle with a full tank to avoid refueling charges."
  },
];

const CarRentalDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: car, isLoading, error } = useCarRental(slug || "");
  const { data: allCars = [] } = useCarRentals();
  const { whatsapp } = useContactConfig();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  
  // Get similar cars (same category, different car)
  const similarCars = allCars
    .filter(c => c.category_id === car?.category_id && c.id !== car?.id)
    .slice(0, 3);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16">
          <div className="container max-w-6xl">
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

  const gallery = car.gallery?.length ? [car.image_url, ...car.gallery] : [car.image_url];

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-16 bg-muted/30">
        <div className="container max-w-6xl">
          {/* Breadcrumb */}
          <Link
            to="/car-rentals"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Car Rentals
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <motion.div 
                  className="relative aspect-video rounded-2xl overflow-hidden bg-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <img
                    src={gallery[activeImage] || "/placeholder.svg"}
                    alt={car.title}
                    className="w-full h-full object-cover"
                  />
                  {car.is_featured && (
                    <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </motion.div>
                
                {gallery.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === i ? "border-secondary" : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Header & Quick Info */}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{car.title}</h1>
                <p className="text-muted-foreground text-lg mb-6">
                  {car.brand} {car.model} • {car.year}
                </p>
                
                {/* Quick Info Pills */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
                    <Users className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium">{car.seats} Seats</span>
                  </div>
                  <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
                    <Fuel className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium">{car.fuel_type}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
                    <Gauge className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium">{car.transmission}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border">
                    <Calendar className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-medium">{car.year}</span>
                  </div>
                </div>
              </div>
              
              {/* Specifications */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                <CarSpecifications car={car} />
              </section>
              
              {/* Features */}
              {car.features.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {car.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 bg-card p-3 rounded-lg border">
                        <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Requirements */}
              {car.requirements.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Rental Requirements</h2>
                  <Card>
                    <CardContent className="p-6">
                      <ul className="space-y-3">
                        {car.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm font-medium flex-shrink-0">
                              {i + 1}
                            </span>
                            <span className="text-muted-foreground">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </section>
              )}
              
              {/* Description */}
              {car.long_description && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">About This Car</h2>
                  <Card>
                    <CardContent className="p-6 prose prose-muted max-w-none">
                      {car.long_description}
                    </CardContent>
                  </Card>
                </section>
              )}
              
              {/* FAQs */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="bg-card rounded-xl border">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} className="border-b last:border-0">
                      <AccordionTrigger className="px-6 text-left hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            </div>
            
            {/* Sidebar */}
            <div>
              <CarBookingCard 
                car={car} 
                whatsapp={whatsapp} 
                onBook={() => setBookingOpen(true)} 
              />
            </div>
          </div>
          
          {/* Similar Cars */}
          {similarCars.length > 0 && (
            <section className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Similar Cars</h2>
                <Link to="/car-rentals" className="text-secondary font-medium flex items-center gap-1 hover:underline">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarCars.map((similarCar) => (
                  <Link 
                    key={similarCar.id} 
                    to={`/car-rentals/${similarCar.category?.slug || 'all'}/${similarCar.slug}`}
                    className="group"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-video relative overflow-hidden">
                        <img 
                          src={similarCar.image_url || "/placeholder.svg"} 
                          alt={similarCar.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold group-hover:text-secondary transition-colors">
                          {similarCar.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {similarCar.brand} • {similarCar.year}
                        </p>
                        <p className="text-secondary font-bold">
                          AED {similarCar.daily_price}/day
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
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
