import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useCarRental, useCarRentals } from "@/hooks/useCarRentals";
import CarBookingModal from "@/components/car-rentals/CarBookingModal";
import CarBookingCard from "@/components/car-rentals/CarBookingCard";
import CarSpecifications from "@/components/car-rentals/CarSpecifications";
import SEOHead, { createProductSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/SEOHead";
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
  ChevronRight,
  Shield,
  MapPin,
  Phone,
  ArrowRight,
  Sparkles,
  Clock,
  Car,
  MessageCircle
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
  {
    question: "Is there a mileage limit?",
    answer: "Daily rentals include 250 km/day. Weekly and monthly rentals come with more generous mileage allowances. Unlimited mileage options are also available on select vehicles."
  },
  {
    question: "Do you offer delivery and pickup?",
    answer: "Yes, we offer free delivery and pickup across Dubai, including hotels, residences, and both airports. Delivery to other emirates is available for a small additional fee."
  },
];

const CarRentalDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: car, isLoading, error } = useCarRental(slug || "");
  const { data: allCars = [] } = useCarRentals();
  const { whatsapp, phone } = useContactConfig();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  
  const similarCars = allCars
    .filter(c => c.category_id === car?.category_id && c.id !== car?.id)
    .slice(0, 3);
  
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16">
          <div className="container max-w-6xl">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
                <div className="flex gap-2">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="w-24 h-16 rounded-lg" />)}
                </div>
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="grid grid-cols-3 gap-4">
                  {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
                </div>
              </div>
              <div>
                <Skeleton className="h-[500px] rounded-xl" />
              </div>
            </div>
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
            <Car className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Car Not Found</h1>
            <p className="text-muted-foreground mb-6">The vehicle you're looking for is no longer available.</p>
            <Link to="/car-rentals">
              <Button className="bg-secondary text-secondary-foreground rounded-xl">
                <ChevronLeft className="w-4 h-4 mr-2" /> Browse All Cars
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const gallery = car.gallery?.length ? [car.image_url, ...car.gallery] : [car.image_url];
  const categoryName = car.category?.name || "Car Rentals";
  const categorySlug = car.category?.slug || "all";
  const originalPrice = Math.round(car.daily_price * 1.2);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Car Rentals", url: "/car-rentals" },
    { name: categoryName, url: `/car-rentals/${categorySlug}` },
    { name: car.title, url: `/car-rentals/${categorySlug}/${car.slug}` },
  ];

  return (
    <Layout>
      <SEOHead
        title={car.meta_title || `${car.title} Rental Dubai – From AED ${car.daily_price}/day`}
        description={car.meta_description || `Rent ${car.title} (${car.brand} ${car.model} ${car.year}) in Dubai. ${car.seats} seats, ${car.transmission}, ${car.fuel_type}. Starting from AED ${car.daily_price}/day with free delivery.`}
        canonical={`/car-rentals/${categorySlug}/${car.slug}`}
        image={car.image_url || undefined}
        type="product"
        keywords={[car.brand, car.model, "car rental dubai", `${car.brand} rental`, categoryName.toLowerCase(), "rent a car dubai"]}
        structuredData={{
          ...createProductSchema({
            name: car.title,
            description: car.description || `${car.brand} ${car.model} ${car.year} rental in Dubai`,
            image: car.image_url || "/placeholder.svg",
            price: car.daily_price,
            currency: "AED",
          }),
          ...createBreadcrumbSchema(breadcrumbs),
          ...createFAQSchema(faqs),
        }}
      />

      {/* Hero Banner */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img
          src={gallery[0] || "/placeholder.svg"}
          alt={car.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent" />
        
        <div className="container max-w-6xl relative h-full flex flex-col justify-end pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/car-rentals" className="hover:text-white transition-colors">Car Rentals</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/car-rentals/${categorySlug}`} className="hover:text-white transition-colors">{categoryName}</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/90">{car.title}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {car.is_featured && (
                <Badge className="bg-secondary/90 text-secondary-foreground backdrop-blur-sm">
                  <Star className="w-3 h-3 mr-1" /> Featured
                </Badge>
              )}
              <Badge variant="outline" className="border-white/30 text-white/90 backdrop-blur-sm">
                {categoryName}
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white/90 backdrop-blur-sm">
                {car.year}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{car.title}</h1>
            <p className="text-white/70 text-lg mb-4">
              {car.brand} {car.model} • {car.seats} Seats • {car.transmission} • {car.fuel_type}
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-white/50 line-through text-lg">AED {originalPrice}</span>
              <span className="text-3xl font-extrabold text-secondary">AED {car.daily_price}</span>
              <span className="text-white/60">/day</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-muted/30 pb-16 lg:pb-24">
        <div className="container max-w-6xl">
          {/* Quick Info Strip */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-3 -mt-8 relative z-10 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {[
              { icon: Users, label: "Passengers", value: `${car.seats} Seats` },
              { icon: Gauge, label: "Transmission", value: car.transmission },
              { icon: Fuel, label: "Fuel Type", value: car.fuel_type },
              { icon: Shield, label: "Deposit", value: `AED ${car.deposit}` },
            ].map((item, i) => (
              <Card key={i} className="bg-card/95 backdrop-blur-md border-border/50 shadow-lg">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="font-semibold text-sm">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Image Gallery */}
              {gallery.length > 1 && (
                <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-card shadow-lg mb-3">
                    <img
                      src={gallery[activeImage] || "/placeholder.svg"}
                      alt={`${car.title} - Image ${activeImage + 1}`}
                      className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    <div className="absolute bottom-3 right-3 bg-primary/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                      {activeImage + 1} / {gallery.length}
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {gallery.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                          activeImage === i ? "border-secondary ring-2 ring-secondary/30" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </motion.section>
              )}
              
              {/* Specifications */}
              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-secondary" /> Specifications
                </h2>
                <CarSpecifications car={car} />
              </motion.section>
              
              {/* Features */}
              {car.features.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" /> Features & Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {car.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2.5 bg-card p-3.5 rounded-xl border border-border/50 hover:border-secondary/30 transition-colors">
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-secondary" />
                        </div>
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}
              
              {/* Requirements */}
              {car.requirements.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-secondary" /> Rental Requirements
                  </h2>
                  <Card className="border-border/50">
                    <CardContent className="p-6">
                      <ul className="space-y-4">
                        {car.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="w-7 h-7 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            <span className="text-muted-foreground leading-relaxed">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.section>
              )}
              
              {/* Description */}
              {car.long_description && (
                <motion.section
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Car className="w-5 h-5 text-secondary" /> About This Car
                  </h2>
                  <Card className="border-border/50">
                    <CardContent className="p-6 prose prose-muted max-w-none text-muted-foreground leading-relaxed">
                      {car.long_description}
                    </CardContent>
                  </Card>
                </motion.section>
              )}

              {/* Why Rent With Us */}
              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <h2 className="text-xl font-bold mb-4">Why Rent With Us?</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { icon: Shield, title: "Fully Insured", desc: "Comprehensive coverage included" },
                    { icon: MapPin, title: "Free Delivery", desc: "To your hotel or address" },
                    { icon: Clock, title: "24/7 Support", desc: "Roadside assistance anytime" },
                    { icon: Star, title: "Best Price", desc: "Price match guarantee" },
                    { icon: Check, title: "No Hidden Fees", desc: "Transparent pricing always" },
                    { icon: Calendar, title: "Flexible Terms", desc: "Daily, weekly, or monthly" },
                  ].map((item, i) => (
                    <Card key={i} className="border-border/50 hover:border-secondary/30 transition-colors">
                      <CardContent className="p-4 text-center">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-2">
                          <item.icon className="w-5 h-5 text-secondary" />
                        </div>
                        <p className="font-semibold text-sm mb-0.5">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.section>
              
              {/* FAQs */}
              <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="bg-card rounded-xl border border-border/50">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} className="border-b border-border/50 last:border-0">
                      <AccordionTrigger className="px-6 text-left hover:no-underline text-sm font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-muted-foreground text-sm leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.section>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <CarBookingCard 
                car={car} 
                whatsapp={whatsapp} 
                onBook={() => setBookingOpen(true)} 
              />

              {/* Need Help Card */}
              <Card className="border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-5 text-center">
                    <MessageCircle className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <h3 className="font-bold text-sm mb-1">Need Help Choosing?</h3>
                    <p className="text-xs text-muted-foreground mb-4">Our team is here to assist you 24/7</p>
                    <div className="space-y-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full rounded-xl text-xs"
                        onClick={() => {
                          const msg = encodeURIComponent(`Hi! I need help choosing a car similar to ${car.title}`);
                          window.open(`https://wa.me/${whatsapp}?text=${msg}`, "_blank");
                        }}
                      >
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Chat on WhatsApp
                      </Button>
                      {phone && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="w-full rounded-xl text-xs text-muted-foreground"
                          onClick={() => window.open(`tel:${phone}`, "_self")}
                        >
                          <Phone className="w-3.5 h-3.5 mr-1.5" /> Call Us
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Similar Cars */}
          {similarCars.length > 0 && (
            <motion.section 
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Similar Vehicles</h2>
                <Link to="/car-rentals" className="text-secondary font-medium flex items-center gap-1 hover:underline text-sm">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarCars.map((similarCar, i) => (
                  <motion.div
                    key={similarCar.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 + i * 0.1 }}
                  >
                    <Link 
                      to={`/car-rentals/${similarCar.category?.slug || 'all'}/${similarCar.slug}`}
                      className="group block"
                    >
                      <Card className="overflow-hidden border-border/50 hover:shadow-xl hover:border-secondary/30 transition-all duration-300">
                        <div className="aspect-video relative overflow-hidden">
                          <img 
                            src={similarCar.image_url || "/placeholder.svg"} 
                            alt={similarCar.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-border/50">
                            <span className="text-secondary font-bold text-sm">AED {similarCar.daily_price}</span>
                            <span className="text-muted-foreground text-[10px]">/day</span>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold group-hover:text-secondary transition-colors mb-1">
                            {similarCar.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-3">
                            {similarCar.brand} • {similarCar.year} • {similarCar.seats} Seats
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Gauge className="w-3 h-3" /> {similarCar.transmission}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Fuel className="w-3 h-3" /> {similarCar.fuel_type}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-card/95 backdrop-blur-lg border-t border-border/50 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-muted-foreground line-through">AED {originalPrice}</span>
              <span className="text-xl font-extrabold text-secondary">AED {car.daily_price}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">per day · Free delivery</p>
          </div>
          <Button 
            onClick={() => setBookingOpen(true)} 
            className="bg-secondary text-secondary-foreground font-bold rounded-xl h-11 px-6"
          >
            Book Now <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
      
      {/* Spacer for mobile sticky bar */}
      <div className="h-20 lg:hidden" />
      
      <CarBookingModal
        car={car}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </Layout>
  );
};

export default CarRentalDetail;
