import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useHotel } from "@/hooks/useHotels";
import { useHotelRooms, HotelRoom } from "@/hooks/useHotelRooms";
import HotelRoomCard from "@/components/hotels/HotelRoomCard";
import HotelEnquiryModal from "@/components/hotels/HotelEnquiryModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, MapPin, Star, Clock, Check, MessageCircle } from "lucide-react";
import { useContactConfig } from "@/hooks/useContactConfig";

const HotelDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: hotel, isLoading, error } = useHotel(slug || "");
  const { data: rooms = [] } = useHotelRooms(hotel?.id || "");
  const { whatsapp } = useContactConfig();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | undefined>();
  
  const handleBookRoom = (room: HotelRoom) => {
    setSelectedRoom(room);
    setEnquiryOpen(true);
  };
  
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

  const renderStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
    ));
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-16">
        <div className="container max-w-5xl">
          {/* Breadcrumb */}
          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Hotels
          </Link>
          
          {/* Main Image */}
          <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
            <img
              src={hotel.image_url || "/placeholder.svg"}
              alt={hotel.name}
              className="w-full h-full object-cover"
            />
            {hotel.is_featured && (
              <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                Featured
              </Badge>
            )}
            <div className="absolute bottom-4 left-4 flex gap-0.5">
              {renderStars(hotel.star_rating)}
            </div>
          </div>
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
              {hotel.location && (
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {hotel.location}
                </p>
              )}
            </div>
            {hotel.price_from && (
              <div className="text-right">
                <p className="text-sm text-muted-foreground">From</p>
                <div className="text-3xl font-bold text-secondary">
                  AED {hotel.price_from}
                </div>
                <p className="text-muted-foreground">per night</p>
              </div>
            )}
          </div>
          
          {/* Quick Info */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-sm">Check-in: {hotel.check_in_time}</span>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-sm">Check-out: {hotel.check_out_time}</span>
            </div>
          </div>
          
          {/* Description */}
          {hotel.description && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-muted-foreground">{hotel.long_description || hotel.description}</p>
            </section>
          )}
          
          {/* Highlights */}
          {hotel.highlights.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hotel.highlights.map((highlight) => (
                  <div key={highlight} className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Amenities */}
          {hotel.amenities.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-sm py-1 px-3">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </section>
          )}
          
          {/* Rooms */}
          {rooms.length > 0 && (
            <section className="mb-12" id="rooms">
              <h2 className="text-xl font-semibold mb-4">Available Rooms</h2>
              <div className="space-y-4">
                {rooms.map((room) => (
                  <HotelRoomCard key={room.id} room={room} onBook={handleBookRoom} />
                ))}
              </div>
            </section>
          )}
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center sticky bottom-4 bg-background p-4 rounded-xl shadow-lg border">
            <Button
              size="lg"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
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
              className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
              onClick={() => {
                const message = encodeURIComponent(`Hi! I'm interested in booking at ${hotel.name}`);
                window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
              }}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              WhatsApp Enquiry
            </Button>
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