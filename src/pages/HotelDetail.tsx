import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
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
  ChevronLeft, 
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
  Mail
} from "lucide-react";
import { useContactConfig } from "@/hooks/useContactConfig";

const amenityIcons: Record<string, React.ElementType> = {
  "wifi": Wifi,
  "parking": Car,
  "gym": Dumbbell,
  "restaurant": UtensilsCrossed,
  "pool": Waves,
  "default": Check,
};

const faqs = [
  {
    question: "What time is check-in and check-out?",
    answer: "Standard check-in time is 3:00 PM and check-out is at 12:00 PM. Early check-in and late check-out may be available upon request, subject to availability."
  },
  {
    question: "Is airport transfer available?",
    answer: "Yes, we can arrange airport transfers for an additional fee. Please contact us at least 24 hours before your arrival to arrange this service."
  },
  {
    question: "Are pets allowed?",
    answer: "Pet policies vary by hotel. Please contact us directly to inquire about specific pet accommodation options."
  },
  {
    question: "Can I cancel my reservation?",
    answer: "Cancellation policies vary depending on the room type and rate selected. Free cancellation is typically available up to 24-48 hours before check-in."
  },
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
  
  if (error || !hotel) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Hotel Not Found</h1>
            <Link to="/hotels">
              <Button>Back to Hotels</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const gallery = hotel.gallery?.length ? [hotel.image_url, ...hotel.gallery] : [hotel.image_url];

  const renderStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
    ));
  };

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    for (const [key, Icon] of Object.entries(amenityIcons)) {
      if (lowerAmenity.includes(key)) return Icon;
    }
    return amenityIcons.default;
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-16 bg-muted/30">
        <div className="container max-w-6xl">
          {/* Breadcrumb */}
          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Hotels
          </Link>
          
          {/* Image Gallery */}
          <div className="space-y-4 mb-8">
            <motion.div 
              className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img
                src={gallery[activeImage] || "/placeholder.svg"}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-2 mb-3">
                  {renderStars(hotel.star_rating)}
                  {hotel.is_featured && (
                    <Badge className="bg-secondary text-secondary-foreground ml-2">
                      Featured
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{hotel.name}</h1>
                {hotel.location && (
                  <p className="text-white/80 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {hotel.location}
                  </p>
                )}
              </div>
            </motion.div>
            
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-28 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === i ? "border-secondary" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info Bar */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-card px-4 py-3 rounded-xl border">
                  <Clock className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Check-in</p>
                    <p className="font-medium">{hotel.check_in_time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-card px-4 py-3 rounded-xl border">
                  <Clock className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Check-out</p>
                    <p className="font-medium">{hotel.check_out_time}</p>
                  </div>
                </div>
                {hotel.contact_phone && (
                  <div className="flex items-center gap-2 bg-card px-4 py-3 rounded-xl border">
                    <Phone className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{hotel.contact_phone}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Description */}
              {hotel.description && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">About This Hotel</h2>
                  <Card>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {hotel.long_description || hotel.description}
                      </p>
                    </CardContent>
                  </Card>
                </section>
              )}
              
              {/* Highlights */}
              {hotel.highlights.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Highlights</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {hotel.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-center gap-3 bg-card p-4 rounded-xl border">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                          <Check className="w-5 h-5 text-secondary" />
                        </div>
                        <span className="font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              
              {/* Amenities */}
              {hotel.amenities.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-4">Amenities</h2>
                  <Card>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {hotel.amenities.map((amenity) => {
                          const Icon = getAmenityIcon(amenity);
                          return (
                            <div key={amenity} className="flex items-center gap-2">
                              <Icon className="w-5 h-5 text-secondary" />
                              <span className="text-sm">{amenity}</span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </section>
              )}
              
              {/* Rooms */}
              {rooms.length > 0 && (
                <section id="rooms">
                  <h2 className="text-xl font-semibold mb-4">Available Rooms</h2>
                  <div className="space-y-4">
                    {rooms.map((room) => (
                      <HotelRoomCard key={room.id} room={room} onBook={handleBookRoom} />
                    ))}
                  </div>
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
            <div className="space-y-6">
              {/* Booking Card */}
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-6">
                  {hotel.price_from && (
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Starting from</p>
                      <div className="text-4xl font-bold text-secondary">
                        AED {hotel.price_from}
                      </div>
                      <p className="text-muted-foreground">per night</p>
                    </div>
                  )}
                  
                  {/* Trust Badges */}
                  <div className="space-y-2 py-4 border-y">
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="w-4 h-4 text-secondary" />
                      <span>Best price guarantee</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-secondary" />
                      <span>Instant confirmation</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-secondary" />
                      <span>Free cancellation available</span>
                    </div>
                  </div>
                  
                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      onClick={() => {
                        setSelectedRoom(undefined);
                        setEnquiryOpen(true);
                      }}
                    >
                      Enquire Now
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                      onClick={() => {
                        const message = encodeURIComponent(`Hi! I'm interested in booking at ${hotel.name}`);
                        window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
                      }}
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      WhatsApp
                    </Button>
                    <a href={`tel:${phone}`} className="block">
                      <Button size="lg" variant="outline" className="w-full">
                        <Phone className="w-5 h-5 mr-2" />
                        Call Now
                      </Button>
                    </a>
                  </div>
                  
                  {/* Contact Info */}
                  {hotel.contact_email && (
                    <div className="pt-4 border-t text-center">
                      <a 
                        href={`mailto:${hotel.contact_email}`}
                        className="text-sm text-muted-foreground hover:text-secondary flex items-center justify-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        {hotel.contact_email}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <HotelEnquiryModal
        hotel={hotel}
        room={selectedRoom}
        open={enquiryOpen}
        onOpenChange={setEnquiryOpen}
      />
    </Layout>
  );
};

export default HotelDetail;
