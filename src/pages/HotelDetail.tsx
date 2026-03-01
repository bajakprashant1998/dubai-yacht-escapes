import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SEOHead, { createBreadcrumbSchema, createFAQSchema, createProductSchema } from "@/components/SEOHead";
import { useHotel } from "@/hooks/useHotels";
import { useHotelRooms, HotelRoom } from "@/hooks/useHotelRooms";
import HotelRoomCard from "@/components/hotels/HotelRoomCard";
import HotelEnquiryModal from "@/components/hotels/HotelEnquiryModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ChevronRight,
  MapPin,
  Star,
  Clock,
  Check,
  MessageCircle,
  Wifi,
  Car,
  Dumbbell,
  UtensilsCrossed,
  Waves,
  Shield,
  Phone,
  Mail,
  ArrowRight,
  Heart,
  Share2,
  BadgePercent,
  Sparkles,
  Building,
  BedDouble,
  Home,
} from "lucide-react";
import { useContactConfig } from "@/hooks/useContactConfig";
import { cn } from "@/lib/utils";

const amenityIcons: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: Car,
  valet: Car,
  gym: Dumbbell,
  fitness: Dumbbell,
  restaurant: UtensilsCrossed,
  dining: UtensilsCrossed,
  breakfast: UtensilsCrossed,
  pool: Waves,
  swim: Waves,
  default: Check,
};

const faqs = [
  { question: "What time is check-in and check-out?", answer: "Standard check-in time is 3:00 PM and check-out is at 12:00 PM. Early check-in and late check-out may be available upon request, subject to availability." },
  { question: "Is airport transfer available?", answer: "Yes, we can arrange airport transfers for an additional fee. Please contact us at least 24 hours before your arrival to arrange this service." },
  { question: "Are pets allowed?", answer: "Pet policies vary by hotel. Please contact us directly to inquire about specific pet accommodation options." },
  { question: "Can I cancel my reservation?", answer: "Cancellation policies vary depending on the room type and rate selected. Free cancellation is typically available up to 24-48 hours before check-in." },
  { question: "Is breakfast included?", answer: "Breakfast inclusion depends on the rate plan selected. Many of our packages include complimentary breakfast. Check the room details for specific inclusions." },
];

const trustBadges = [
  { icon: Shield, label: "Best Price Guarantee" },
  { icon: Check, label: "Instant Confirmation" },
  { icon: Clock, label: "Free Cancellation" },
  { icon: BadgePercent, label: "Exclusive Rates" },
];

const HotelDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: hotel, isLoading, error } = useHotel(slug || "");
  const { data: rooms = [] } = useHotelRooms(hotel?.id || "");
  const { whatsapp, phone } = useContactConfig();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | undefined>();
  const [activeImage, setActiveImage] = useState(0);

  const handleBookRoom = (room: HotelRoom) => {
    setSelectedRoom(room);
    setEnquiryOpen(true);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen">
          <Skeleton className="h-[50vh] w-full" />
          <div className="container max-w-6xl py-8 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !hotel) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <Building className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Hotel Not Found</h1>
            <p className="text-muted-foreground mb-6">The hotel you're looking for doesn't exist or has been removed.</p>
            <Link to="/hotels">
              <Button className="rounded-xl">Back to Hotels</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const gallery = hotel.gallery?.length ? [hotel.image_url, ...hotel.gallery].filter(Boolean) : [hotel.image_url].filter(Boolean);
  const reviewScore = (hotel.star_rating * 1.6 + 1.2).toFixed(1);
  const categorySlug = hotel.category?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "all";

  const getAmenityIcon = (amenity: string) => {
    const l = amenity.toLowerCase();
    for (const [key, Icon] of Object.entries(amenityIcons)) {
      if (l.includes(key)) return Icon;
    }
    return amenityIcons.default;
  };

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Hotels", url: "/hotels" },
    { name: hotel.name, url: `/hotels/${categorySlug}/${hotel.slug}` },
  ];

  return (
    <Layout>
      <SEOHead
        title={hotel.meta_title || `${hotel.name} – ${hotel.star_rating}-Star Hotel in Dubai`}
        description={hotel.meta_description || hotel.description || `Book ${hotel.name} in Dubai. ${hotel.star_rating}-star hotel with exclusive rates and instant confirmation.`}
        canonical={`/hotels/${categorySlug}/${hotel.slug}`}
        image={hotel.image_url || undefined}
        type="product"
        structuredData={[
          createBreadcrumbSchema(breadcrumbs),
          createFAQSchema(faqs),
          ...(hotel.price_from
            ? [createProductSchema({ name: hotel.name, description: hotel.description || "", image: hotel.image_url || "", price: hotel.price_from, rating: parseFloat(reviewScore) / 2, reviewCount: 47 })]
            : []),
        ]}
        keywords={["Dubai hotel", hotel.name, `${hotel.star_rating} star hotel Dubai`, hotel.location || "Dubai", "luxury hotel booking"]}
      />

      {/* Cinematic Hero */}
      <section className="relative h-[55vh] md:h-[60vh] overflow-hidden bg-primary">
        <motion.img
          src={gallery[activeImage] || "/placeholder.svg"}
          alt={hotel.name}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
          key={activeImage}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-24 md:pt-28">
          <div className="container max-w-6xl">
            <nav className="flex items-center gap-2 text-sm text-white/70">
              <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" /> Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/hotels" className="hover:text-white transition-colors">Hotels</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white font-medium truncate max-w-[200px]">{hotel.name}</span>
            </nav>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-24 md:top-28 right-4 md:right-8 z-20 flex items-center gap-2">
          <button className="p-2.5 bg-background/20 backdrop-blur-md rounded-xl hover:bg-background/30 transition-colors">
            <Heart className="w-5 h-5 text-white" />
          </button>
          <button className="p-2.5 bg-background/20 backdrop-blur-md rounded-xl hover:bg-background/30 transition-colors">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container max-w-6xl pb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: hotel.star_rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                  ))}
                </div>
                {hotel.is_featured && (
                  <Badge className="bg-secondary/90 text-secondary-foreground rounded-lg text-xs">⭐ Featured</Badge>
                )}
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/20 rounded-lg text-xs">
                  {reviewScore} / 10
                </Badge>
              </div>
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-3 leading-tight">{hotel.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                {hotel.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-secondary" /> {hotel.location}
                  </span>
                )}
                {hotel.category && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span>{hotel.category}</span>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Thumbnail Strip */}
      {gallery.length > 1 && (
        <div className="bg-card border-b border-border">
          <div className="container max-w-6xl py-3">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {gallery.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "flex-shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all",
                    activeImage === i ? "border-secondary shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trust Strip */}
      <div className="bg-card border-b border-border">
        <div className="container max-w-6xl py-3">
          <div className="flex items-center justify-between gap-6 overflow-x-auto scrollbar-hide">
            {trustBadges.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap shrink-0">
                <item.icon className="w-4 h-4 text-secondary" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-muted/30 py-8 pb-16">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info Cards */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="bg-card p-4 rounded-xl border border-border text-center">
                  <Clock className="w-5 h-5 text-secondary mx-auto mb-1.5" />
                  <p className="text-xs text-muted-foreground">Check-in</p>
                  <p className="font-semibold text-sm">{hotel.check_in_time || "3:00 PM"}</p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border text-center">
                  <Clock className="w-5 h-5 text-secondary mx-auto mb-1.5" />
                  <p className="text-xs text-muted-foreground">Check-out</p>
                  <p className="font-semibold text-sm">{hotel.check_out_time || "12:00 PM"}</p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border text-center">
                  <BedDouble className="w-5 h-5 text-secondary mx-auto mb-1.5" />
                  <p className="text-xs text-muted-foreground">Rooms</p>
                  <p className="font-semibold text-sm">{rooms.length || "Multiple"}</p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border text-center">
                  <Star className="w-5 h-5 text-secondary fill-secondary mx-auto mb-1.5" />
                  <p className="text-xs text-muted-foreground">Rating</p>
                  <p className="font-semibold text-sm">{reviewScore}/10</p>
                </div>
              </motion.div>

              {/* About */}
              {(hotel.long_description || hotel.description) && (
                <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" />
                    About This Hotel
                  </h2>
                  <Card className="rounded-xl border-border/50">
                    <CardContent className="p-6">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {hotel.long_description || hotel.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.section>
              )}

              {/* Highlights */}
              {hotel.highlights.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <h2 className="text-xl font-semibold mb-4">Why Stay Here</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {hotel.highlights.map((highlight, i) => (
                      <div key={highlight} className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border/50 hover:border-secondary/30 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                          <Check className="w-5 h-5 text-secondary" />
                        </div>
                        <span className="font-medium text-sm">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Amenities */}
              {hotel.amenities.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <h2 className="text-xl font-semibold mb-4">Hotel Amenities</h2>
                  <Card className="rounded-xl border-border/50">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {hotel.amenities.map((amenity) => {
                          const Icon = getAmenityIcon(amenity);
                          return (
                            <div key={amenity} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                                <Icon className="w-4 h-4 text-secondary" />
                              </div>
                              <span className="text-sm">{amenity}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </motion.section>
              )}

              {/* Rooms */}
              {rooms.length > 0 && (
                <motion.section id="rooms" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <BedDouble className="w-5 h-5 text-secondary" />
                    Available Rooms
                    <Badge variant="secondary" className="text-xs rounded-lg">{rooms.length}</Badge>
                  </h2>
                  <div className="space-y-4">
                    {rooms.map((room) => (
                      <HotelRoomCard key={room.id} room={room} onBook={handleBookRoom} />
                    ))}
                  </div>
                </motion.section>
              )}

              {/* FAQs */}
              <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="bg-card rounded-xl border border-border/50">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} className="border-b last:border-0">
                      <AccordionTrigger className="px-6 text-left hover:no-underline text-sm font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 text-muted-foreground text-sm">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.section>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Booking Card */}
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Card className="sticky top-24 rounded-xl border-border/50 shadow-lg overflow-hidden">
                  {/* Urgency Banner */}
                  <div className="bg-secondary/10 border-b border-secondary/20 px-5 py-2.5 flex items-center justify-center gap-2">
                    <span className="text-xs font-semibold text-secondary">🔥 High demand — book early!</span>
                  </div>

                  <CardContent className="p-5 space-y-5">
                    {hotel.price_from && (
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Starting from</p>
                        <div className="flex items-baseline justify-center gap-1.5">
                          <span className="text-sm text-muted-foreground line-through">
                            AED {Math.round(hotel.price_from * 1.2).toLocaleString()}
                          </span>
                          <span className="text-3xl font-bold text-secondary">
                            AED {hotel.price_from.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">per night</p>
                        <Badge className="mt-2 bg-green-500/10 text-green-600 border-green-500/20 text-xs rounded-lg">
                          You save AED {Math.round(hotel.price_from * 0.2).toLocaleString()} (20%)
                        </Badge>
                      </div>
                    )}

                    {/* Trust Badges */}
                    <div className="space-y-2 py-4 border-y border-border/50">
                      {[
                        { icon: Shield, label: "Best price guarantee" },
                        { icon: Check, label: "Instant confirmation" },
                        { icon: Clock, label: "Free cancellation available" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2.5 text-sm">
                          <item.icon className="w-4 h-4 text-secondary shrink-0" />
                          <span>{item.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="space-y-3">
                      <Button
                        size="lg"
                        className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-bold shadow-lg shadow-secondary/20 gap-2"
                        data-hotel-enquire
                        onClick={() => { setSelectedRoom(undefined); setEnquiryOpen(true); }}
                      >
                        Enquire Now
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white rounded-xl font-medium"
                        onClick={() => {
                          const message = encodeURIComponent(`Hi! I'm interested in booking at ${hotel.name}. Can you share the best rates?`);
                          window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
                        }}
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        WhatsApp Inquiry
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <a href={`tel:${phone}`}>
                          <Button variant="outline" size="sm" className="w-full rounded-xl text-xs">
                            <Phone className="w-3.5 h-3.5 mr-1.5" /> Call Us
                          </Button>
                        </a>
                        {rooms.length > 0 && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full rounded-xl text-xs"
                            onClick={() => document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" })}
                          >
                            <BedDouble className="w-3.5 h-3.5 mr-1.5" /> View Rooms
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    {hotel.contact_email && (
                      <div className="pt-3 border-t border-border/50 text-center">
                        <a href={`mailto:${hotel.contact_email}`} className="text-xs text-muted-foreground hover:text-secondary flex items-center justify-center gap-1.5 transition-colors">
                          <Mail className="w-3.5 h-3.5" />
                          {hotel.contact_email}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Need Help */}
              <Card className="rounded-xl border-border/50">
                <CardContent className="p-5 space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4 text-secondary" />
                    Need Help?
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Our Dubai travel experts are available 24/7 to help you find the perfect room and rate.
                  </p>
                  <Button size="sm" variant="outline" className="w-full rounded-xl" asChild>
                    <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi! I need help choosing a hotel room.")}`} target="_blank" rel="noopener noreferrer">
                      Chat on WhatsApp
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/95 backdrop-blur-md border-t border-border p-3 pb-safe">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            {hotel.price_from && (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs text-muted-foreground line-through">AED {Math.round(hotel.price_from * 1.2).toLocaleString()}</span>
                  <span className="text-lg font-bold text-secondary">AED {hotel.price_from.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">per night</p>
              </>
            )}
          </div>
          <Button
            className="bg-secondary text-secondary-foreground font-bold rounded-xl h-11 px-6 shadow-lg shadow-secondary/20"
            onClick={() => document.querySelector<HTMLButtonElement>("[data-hotel-enquire]")?.click()}
          >
            Enquire Now <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <HotelEnquiryModal hotel={hotel} room={selectedRoom} open={enquiryOpen} onOpenChange={setEnquiryOpen} />
    </Layout>
  );
};

export default HotelDetail;
