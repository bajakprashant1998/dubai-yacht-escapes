import { useState, useEffect } from "react";
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
  Camera,
  ArrowRight,
  Sparkles,
  ThumbsUp,
  MessageCircle,
  Headphones,
  Lock,
  Award,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useService, useServicesByCategory } from "@/hooks/useServices";
import { useContactConfig } from "@/hooks/useContactConfig";
import ServiceBookingModal from "@/components/service-detail/ServiceBookingModal";
import ServiceCardRedesigned from "@/components/ServiceCardRedesigned";
import { addToRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useCurrency } from "@/hooks/useCurrency";
import SEOHead from "@/components/SEOHead";

const ServiceDetail = () => {
  const { slug, categoryPath } = useParams();
  const navigate = useNavigate();
  const { data: service, isLoading, error } = useService(slug || "");
  const { whatsappLink, phone, phoneFormatted } = useContactConfig();
  const { formatPrice } = useCurrency();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  // Fetch related services from same category
  const { data: relatedServices } = useServicesByCategory(service?.categorySlug || "");
  const filteredRelated = relatedServices?.filter(s => s.id !== service?.id)?.slice(0, 3) || [];

  useEffect(() => {
    if (service) {
      addToRecentlyViewed({
        type: "service",
        id: service.id,
        slug: service.slug,
        categorySlug: service.categorySlug,
        title: service.title,
        image: service.imageUrl || "/placeholder.svg",
        price: service.price,
      });
    }
  }, [service]);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-28 pb-16 container">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-[500px] w-full rounded-2xl mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96 rounded-2xl" />
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

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

  const handleShare = async () => {
    try {
      await navigator.share({ title: service.title, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link copied!" });
    }
  };

  return (
    <Layout>
      <SEOHead
        title={service.metaTitle || `${service.title} | Dubai Experiences`}
        description={service.metaDescription || service.description || `Book ${service.title} in Dubai. Best price guaranteed with instant confirmation.`}
        canonical={`/dubai/services/${service.categorySlug || 'general'}/${service.slug}`}
        keywords={service.metaKeywords?.length ? service.metaKeywords : [service.title, "Dubai", service.categoryName || "experience"]}
      />

      <div className="pt-24 pb-0">
        {/* Breadcrumb */}
        <div className="container mb-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-secondary transition-colors">Home</Link>
            <span className="text-border">/</span>
            <Link to="/services" className="hover:text-secondary transition-colors">Experiences</Link>
            {service.categoryName && (
              <>
                <span className="text-border">/</span>
                <Link
                  to={`/dubai/services/${service.categorySlug}`}
                  className="hover:text-secondary transition-colors"
                >
                  {service.categoryName}
                </Link>
              </>
            )}
            <span className="text-border">/</span>
            <span className="text-foreground font-medium truncate max-w-[200px]">{service.title}</span>
          </nav>
        </div>

        <div className="container">
          {/* Immersive Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="relative rounded-3xl overflow-hidden bg-muted group">
              {/* Main Image */}
              <div className="relative aspect-[16/9] lg:aspect-[21/9]">
                <img
                  src={allImages[currentImageIndex]}
                  alt={service.imageAlt || service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-primary/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-transparent" />

                {/* Top-right action buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-card/60 backdrop-blur-md flex items-center justify-center text-card-foreground hover:bg-card/90 transition-all shadow-lg"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={cn(
                      "w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-lg",
                      isSaved ? "bg-destructive text-destructive-foreground" : "bg-card/60 text-card-foreground hover:bg-card/90"
                    )}
                  >
                    <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
                  </button>
                </div>

                {/* Top-left badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {service.categoryName && (
                    <Badge className="bg-card/80 backdrop-blur-md text-card-foreground border-0 shadow-lg px-3 py-1">
                      {service.categoryName}
                    </Badge>
                  )}
                  {discount && discount > 0 && (
                    <Badge className="bg-destructive text-destructive-foreground border-0 shadow-lg shadow-destructive/30 px-3 py-1">
                      {discount}% OFF
                    </Badge>
                  )}
                  {service.isFeatured && (
                    <Badge className="bg-secondary text-secondary-foreground border-0 shadow-lg shadow-secondary/30 px-3 py-1">
                      <Zap className="w-3 h-3 mr-1" /> Best Seller
                    </Badge>
                  )}
                </div>

                {/* Navigation arrows */}
                {allImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-card/40 backdrop-blur-md hover:bg-card/80 text-card-foreground rounded-full w-11 h-11 shadow-lg"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-card/40 backdrop-blur-md hover:bg-card/80 text-card-foreground rounded-full w-11 h-11 shadow-lg"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}

                {/* Bottom overlay info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                  <div className="flex items-end justify-between">
                    {allImages.length > 1 && (
                      <div className="flex items-center gap-1.5 bg-card/50 backdrop-blur-md px-3 py-1.5 rounded-full text-card-foreground text-sm">
                        <Camera className="w-3.5 h-3.5" />
                        {currentImageIndex + 1} / {allImages.length}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {allImages.slice(0, 8).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={cn(
                        "w-14 h-10 rounded-lg overflow-hidden border-2 transition-all duration-300 shadow-md",
                        idx === currentImageIndex
                          ? "border-secondary scale-110 shadow-secondary/30"
                          : "border-card/50 opacity-70 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Quick Info */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
              >
                <h1 className="text-3xl lg:text-4xl font-display font-bold mb-3 tracking-tight">
                  {service.title}
                </h1>
                {service.subtitle && (
                  <p className="text-lg text-muted-foreground mb-5">{service.subtitle}</p>
                )}

                {/* Rating & Quick Pills */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-secondary/10 px-3 py-1.5 rounded-full">
                    <Star className="w-4 h-4 text-secondary fill-secondary" />
                    <span className="font-bold text-secondary">{service.rating.toFixed(1)}</span>
                    <span className="text-sm text-muted-foreground">
                      ({service.reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>
                  {service.duration && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 text-sm">
                      <Clock className="w-4 h-4 text-secondary" />
                      <span>{service.duration}</span>
                    </div>
                  )}
                  {service.hotelPickup && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 text-sm">
                      <Car className="w-4 h-4 text-secondary" />
                      <span>Hotel Pickup</span>
                    </div>
                  )}
                  {service.instantConfirmation && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-sm text-green-700 dark:text-green-400">
                      <Zap className="w-4 h-4" />
                      <span className="font-medium">Instant Confirmation</span>
                    </div>
                  )}
                  {service.maxParticipants && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 text-sm">
                      <Users className="w-4 h-4 text-secondary" />
                      <span>Max {service.maxParticipants}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
              >
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="w-full justify-start bg-muted/50 rounded-xl p-1 h-auto flex-wrap">
                    <TabsTrigger value="overview" className="rounded-lg px-5 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium">Overview</TabsTrigger>
                    <TabsTrigger value="included" className="rounded-lg px-5 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium">What's Included</TabsTrigger>
                    <TabsTrigger value="details" className="rounded-lg px-5 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium">Details</TabsTrigger>
                    {service.itinerary && service.itinerary.length > 0 && (
                      <TabsTrigger value="itinerary" className="rounded-lg px-5 py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium">Itinerary</TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="overview" className="pt-8 space-y-8">
                    {service.description && (
                      <div>
                        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-secondary" />
                          About This Experience
                        </h3>
                        <p className="text-muted-foreground leading-relaxed text-[15px]">
                          {service.description}
                        </p>
                      </div>
                    )}
                    {service.longDescription && (
                      <div
                        className="prose prose-sm max-w-none text-muted-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_strong]:text-foreground [&_ul]:list-disc [&_ol]:list-decimal [&_li]:ml-4"
                        dangerouslySetInnerHTML={{ __html: service.longDescription }}
                      />
                    )}
                    {service.highlights && service.highlights.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Star className="w-5 h-5 text-secondary" />
                          Highlights
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {service.highlights.map((highlight, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.05 }}
                              className="flex items-start gap-3 p-3 rounded-xl bg-secondary/5 border border-secondary/10"
                            >
                              <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle className="w-3.5 h-3.5 text-secondary" />
                              </div>
                              <span className="text-sm">{highlight}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="included" className="pt-8 space-y-8">
                    {service.included && service.included.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          What's Included
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {service.included.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                              <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-3 h-3 text-green-600" />
                              </div>
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {service.excluded && service.excluded.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-destructive" />
                          What's Not Included
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {service.excluded.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/10">
                              <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                                <XCircle className="w-3 h-3 text-destructive" />
                              </div>
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="details" className="pt-8 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {service.duration && (
                        <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-6 h-6 text-secondary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Duration</p>
                            <p className="font-bold text-foreground">{service.duration}</p>
                          </div>
                        </div>
                      )}
                      {service.meetingPoint && (
                        <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-6 h-6 text-secondary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Meeting Point</p>
                            <p className="font-bold text-foreground">{service.meetingPoint}</p>
                          </div>
                        </div>
                      )}
                      {service.location && (
                        <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-6 h-6 text-secondary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Location</p>
                            <p className="font-bold text-foreground">{service.location}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <Users className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Group Size</p>
                          <p className="font-bold text-foreground">
                            {service.minParticipants}
                            {service.maxParticipants && ` - ${service.maxParticipants}`} guests
                          </p>
                        </div>
                      </div>
                      {service.cancellationPolicy && (
                        <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Cancellation</p>
                            <p className="font-bold text-foreground">{service.cancellationPolicy}</p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <Info className="w-6 h-6 text-secondary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Booking Type</p>
                          <p className="font-bold text-foreground capitalize">
                            {service.bookingType.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Itinerary Tab */}
                  {service.itinerary && service.itinerary.length > 0 && (
                    <TabsContent value="itinerary" className="pt-8">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-secondary" />
                        Your Experience Timeline
                      </h3>
                      <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-secondary via-secondary/50 to-secondary/20" />
                        <div className="space-y-6">
                          {service.itinerary.map((item, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.08 }}
                              className="flex gap-4 relative"
                            >
                              <div className="w-10 h-10 rounded-full bg-secondary/10 border-2 border-secondary flex items-center justify-center flex-shrink-0 z-10">
                                <span className="text-xs font-bold text-secondary">{idx + 1}</span>
                              </div>
                              <div className="flex-1 pb-2">
                                <p className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1">{item.time}</p>
                                <p className="text-sm text-foreground font-medium">{item.activity}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </motion.div>

              {/* FAQs */}
              {service.faqs && service.faqs.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-secondary" />
                    Frequently Asked Questions
                  </h3>
                  <Accordion type="single" collapsible className="space-y-2">
                    {service.faqs.map((faq, idx) => (
                      <AccordionItem
                        key={idx}
                        value={`faq-${idx}`}
                        className="border border-border/50 rounded-xl px-5 data-[state=open]:bg-secondary/5 data-[state=open]:border-secondary/20 transition-colors"
                      >
                        <AccordionTrigger className="text-sm font-semibold hover:text-secondary transition-colors py-4 [&>svg]:text-secondary">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              )}

              {/* Need Help CTA */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent border border-secondary/20 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-6 h-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-foreground mb-1">Need Help Choosing?</h4>
                  <p className="text-sm text-muted-foreground">Our travel experts are available 24/7 to help you plan the perfect experience.</p>
                </div>
                <div className="flex gap-2">
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl font-semibold gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> WhatsApp
                    </Button>
                  </a>
                  <a href={`tel:${phone}`}>
                    <Button size="sm" variant="outline" className="rounded-xl font-semibold gap-1.5">
                      <Phone className="w-3.5 h-3.5" /> Call
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <div className="sticky top-28 rounded-3xl border border-border/50 bg-card shadow-xl overflow-hidden">
                  {/* Price header with gradient */}
                  <div className="bg-gradient-to-br from-secondary/10 via-card to-card p-6 pb-5">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm text-muted-foreground">From</p>
                      {discount && discount > 0 && (
                        <Badge className="bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 text-xs font-bold">
                          Save {discount}%
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-4xl font-extrabold text-secondary">
                        {formatPrice(service.price)}
                      </span>
                      {service.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          {formatPrice(service.originalPrice)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {service.bookingType === "per_person" && "per person"}
                      {service.bookingType === "per_group" && "per group"}
                      {service.bookingType === "per_vehicle" && "per vehicle"}
                    </p>
                  </div>

                  <div className="p-6 pt-4 space-y-4">
                    {/* Trust Badges */}
                    <div className="flex flex-wrap gap-2">
                      {service.instantConfirmation && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 text-xs font-medium text-green-700 dark:text-green-400">
                          <Zap className="w-3 h-3" />
                          Instant Confirmation
                        </div>
                      )}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/10 text-xs font-medium text-secondary">
                        <Shield className="w-3 h-3" />
                        Best Price Guarantee
                      </div>
                    </div>

                    {/* CTA Buttons */}
                    <Button
                      onClick={() => setIsBookingOpen(true)}
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-13 text-base font-bold rounded-xl shadow-lg shadow-secondary/20 transition-all hover:shadow-xl hover:shadow-secondary/30 gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      Check Availability
                      <ArrowRight className="w-4 h-4 ml-auto" />
                    </Button>

                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" className="w-full h-12 rounded-xl border-2 gap-2 font-semibold hover:border-secondary/50">
                        <Phone className="w-4 h-4" />
                        WhatsApp Inquiry
                      </Button>
                    </a>

                    {/* Divider */}
                    <div className="border-t border-dashed border-border/60" />

                    {/* Features */}
                    <div className="space-y-3">
                      {service.hotelPickup && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                            <Car className="w-4 h-4 text-secondary" />
                          </div>
                          <span>Free hotel pickup included</span>
                        </div>
                      )}
                      {service.cancellationPolicy && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <span>{service.cancellationPolicy}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <Lock className="w-4 h-4 text-secondary" />
                        </div>
                        <span>Secure online booking</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                          <Headphones className="w-4 h-4 text-secondary" />
                        </div>
                        <span>24/7 customer support</span>
                      </div>
                    </div>

                    {/* Urgency */}
                    <div className="rounded-xl bg-destructive/5 border border-destructive/15 p-3 text-center">
                      <p className="text-xs font-semibold text-destructive flex items-center justify-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        High demand — Book early to secure your spot!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Related Experiences */}
        {filteredRelated.length > 0 && (
          <section className="py-16 mt-8 bg-muted/20">
            <div className="container">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-display font-bold text-foreground">
                    Similar Experiences
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">You might also enjoy these {service.categoryName?.toLowerCase()} experiences</p>
                </div>
                <Button variant="outline" asChild className="rounded-xl hidden sm:flex">
                  <Link to={`/dubai/services/${service.categorySlug}`}>
                    View All <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRelated.map((s) => (
                  <ServiceCardRedesigned key={s.id} service={s} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* spacer for mobile bottom bar */}
        <div className="h-20 lg:hidden" />
      </div>

      {/* Mobile Sticky Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">From</p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-secondary">{formatPrice(service.price)}</span>
              {service.originalPrice && service.originalPrice > service.price && (
                <span className="text-xs text-muted-foreground line-through">{formatPrice(service.originalPrice)}</span>
              )}
            </div>
          </div>
          <Button
            onClick={() => setIsBookingOpen(true)}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold rounded-xl shadow-lg shadow-secondary/20 gap-1.5 px-6 h-11"
          >
            Book Now
            <ArrowRight className="w-4 h-4" />
          </Button>
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
