import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Clock,
  MapPin,
  Star,
  Users,
  CheckCircle,
  XCircle,
  Car,
  Calendar,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Phone,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useService } from "@/hooks/useServices";
import { useContactConfig } from "@/hooks/useContactConfig";
import ServiceBookingModal from "@/components/service-detail/ServiceBookingModal";

const ServiceDetail = () => {
  const { slug, categoryPath } = useParams();
  const navigate = useNavigate();
  const { data: service, isLoading, error } = useService(slug || "");
  const { whatsappLink } = useContactConfig();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-28 pb-16 container">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96 rounded-xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !service) {
    return (
      <Layout>
        <div className="pt-32 pb-16 container text-center">
          <h1 className="text-2xl font-bold mb-4">Experience not found</h1>
          <p className="text-muted-foreground mb-6">
            The experience you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/services")}>Browse Experiences</Button>
        </div>
      </Layout>
    );
  }

  const allImages = [service.imageUrl, ...(service.gallery || [])].filter(Boolean);
  const discount = service.originalPrice
    ? Math.round(((service.originalPrice - service.price) / service.originalPrice) * 100)
    : null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <Layout>
      <div className="pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="container mb-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to="/services" className="hover:text-foreground">Experiences</Link>
            {service.categoryName && (
              <>
                <span>/</span>
                <Link
                  to={`/dubai/services/${service.categorySlug}`}
                  className="hover:text-foreground"
                >
                  {service.categoryName}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{service.title}</span>
          </nav>
        </div>

        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
                <img
                  src={allImages[currentImageIndex]}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                {allImages.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {allImages.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            idx === currentImageIndex ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {service.categoryName && (
                    <Badge className="bg-primary/90 text-primary-foreground">
                      {service.categoryName}
                    </Badge>
                  )}
                  {discount && discount > 0 && (
                    <Badge className="bg-destructive text-destructive-foreground">
                      {discount}% OFF
                    </Badge>
                  )}
                </div>
              </div>

              {/* Title & Quick Info */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-display font-bold mb-4">
                  {service.title}
                </h1>
                {service.subtitle && (
                  <p className="text-lg text-muted-foreground mb-4">{service.subtitle}</p>
                )}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="font-semibold">{service.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">
                      ({service.reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>
                  {service.duration && (
                    <Badge variant="outline" className="text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {service.duration}
                    </Badge>
                  )}
                  {service.hotelPickup && (
                    <Badge variant="outline" className="text-sm">
                      <Car className="w-4 h-4 mr-1" />
                      Hotel Pickup
                    </Badge>
                  )}
                  {service.instantConfirmation && (
                    <Badge variant="outline" className="text-sm text-green-600 border-green-600">
                      <Zap className="w-4 h-4 mr-1" />
                      Instant Confirmation
                    </Badge>
                  )}
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="included">What's Included</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="pt-6 space-y-6">
                  {service.description && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">About This Experience</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  )}
                  {service.longDescription && (
                    <div
                      className="prose prose-sm max-w-none text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: service.longDescription }}
                    />
                  )}
                  {service.highlights && service.highlights.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Highlights</h3>
                      <ul className="space-y-2">
                        {service.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="included" className="pt-6 space-y-6">
                  {service.included && service.included.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        What's Included
                      </h3>
                      <ul className="space-y-2">
                        {service.included.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {service.excluded && service.excluded.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-destructive" />
                        What's Not Included
                      </h3>
                      <ul className="space-y-2">
                        {service.excluded.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="details" className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.duration && (
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <Clock className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">{service.duration}</p>
                        </div>
                      </div>
                    )}
                    {service.meetingPoint && (
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Meeting Point</p>
                          <p className="font-medium">{service.meetingPoint}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Group Size</p>
                        <p className="font-medium">
                          {service.minParticipants}
                          {service.maxParticipants && ` - ${service.maxParticipants}`} guests
                        </p>
                      </div>
                    </div>
                    {service.cancellationPolicy && (
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                        <Shield className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Cancellation</p>
                          <p className="font-medium">{service.cancellationPolicy}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-28 shadow-lg border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">From</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">
                          AED {service.price.toLocaleString()}
                        </span>
                        {service.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            AED {service.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {service.bookingType === "per_person" && "per person"}
                        {service.bookingType === "per_group" && "per group"}
                        {service.bookingType === "per_vehicle" && "per vehicle"}
                      </p>
                    </div>
                    {discount && discount > 0 && (
                      <Badge className="bg-destructive text-destructive-foreground text-sm">
                        Save {discount}%
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Trust Badges */}
                  <div className="flex flex-wrap gap-2">
                    {service.instantConfirmation && (
                      <Badge variant="outline" className="text-xs">
                        <Zap className="w-3 h-3 mr-1 text-green-500" />
                        Instant Confirmation
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Best Price Guarantee
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <Button 
                    onClick={() => setIsBookingOpen(true)}
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 text-lg font-semibold"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Check Availability
                  </Button>

                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full h-12">
                      <Phone className="w-5 h-5 mr-2" />
                      WhatsApp Inquiry
                    </Button>
                  </a>

                  {/* Features */}
                  <div className="pt-4 border-t border-border space-y-3">
                    {service.hotelPickup && (
                      <div className="flex items-center gap-2 text-sm">
                        <Car className="w-4 h-4 text-secondary" />
                        <span>Free hotel pickup included</span>
                      </div>
                    )}
                    {service.cancellationPolicy && (
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{service.cancellationPolicy}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {service && (
        <ServiceBookingModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          service={{
            id: service.id,
            slug: service.slug,
            title: service.title,
            price: service.price,
            bookingType: service.bookingType,
            maxParticipants: service.maxParticipants,
          }}
        />
      )}
    </Layout>
  );
};

export default ServiceDetail;
