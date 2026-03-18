import { useState, useRef, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, Clock, Hotel, Car, Ticket, FileText, MapPin, Users, Heart, Mountain, Crown, Sparkles,
  Shield, CheckCircle, Star, ArrowRight, MessageCircle, Phone, Award, TrendingUp,
  Share2, Calendar, ThumbsUp, Quote, ChevronDown, Play, Pause, Camera, Globe, Utensils, Copy, Check
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import ComboItinerary from "@/components/combo/ComboItinerary";
import ComboPricing from "@/components/combo/ComboPricing";
import ComboBookingCard from "@/components/combo/ComboBookingCard";
import ComboCard from "@/components/combo/ComboCard";
import ComboGallery from "@/components/combo/ComboGallery";
import SEOHead, { createProductSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/SEOHead";
import { useComboPackageWithItems, useComboPackages } from "@/hooks/useComboPackages";
import { useCurrency } from "@/hooks/useCurrency";
import { useContactConfig } from "@/hooks/useContactConfig";
import { useTestimonials } from "@/hooks/useTestimonials";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const comboTypeConfig: Record<string, { icon: React.ElementType; color: string; label: string; gradient: string }> = {
  essentials: { icon: Sparkles, color: "bg-secondary", label: "Essentials", gradient: "from-secondary/20 to-secondary/5" },
  family: { icon: Users, color: "bg-green-500", label: "Family", gradient: "from-green-500/20 to-green-500/5" },
  couple: { icon: Heart, color: "bg-pink-500", label: "Romantic", gradient: "from-pink-500/20 to-pink-500/5" },
  adventure: { icon: Mountain, color: "bg-orange-500", label: "Adventure", gradient: "from-orange-500/20 to-orange-500/5" },
  luxury: { icon: Crown, color: "bg-amber-500", label: "Luxury", gradient: "from-amber-500/20 to-amber-500/5" },
};

const tabs = [
  { id: "overview", label: "Overview", icon: Globe },
  { id: "itinerary", label: "Itinerary", icon: Calendar },
  { id: "pricing", label: "Pricing", icon: Ticket },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "faq", label: "FAQ", icon: MessageCircle },
];

const faqs = [
  { question: "Can I customize this combo package?", answer: "Absolutely! Use our AI Trip Planner to swap activities, upgrade hotels, extend your stay, or adjust the itinerary to match your preferences. Real-time pricing updates as you customize." },
  { question: "What happens if I need to cancel?", answer: "Free cancellation is available up to 24 hours before your trip starts. After that, a partial refund may apply depending on the specific services booked. Full details are shared upon confirmation." },
  { question: "Are meals included in the package?", answer: "Meal inclusions vary by package. Some activities include meals (like dinner cruises or desert safari BBQ). Hotel breakfast is typically included with 4-5 star accommodations. Check the itinerary for details." },
  { question: "Is airport transfer included?", answer: "Yes, all packages with transport include complimentary airport pickup and drop-off. We'll have a driver waiting for you at arrivals with a name board." },
  { question: "Can I book for a large group?", answer: "Yes! We accommodate groups of all sizes. For groups of 6+, contact us for special group pricing and customized arrangements. We can tailor the entire experience for your group." },
];

const ComboPackageDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: combo, isLoading } = useComboPackageWithItems(slug || "");
  const { data: relatedCombos } = useComboPackages({ type: combo?.combo_type, activeOnly: true });
  const { formatPrice } = useCurrency();
  const { whatsapp, phone } = useContactConfig();
  const { data: testimonials } = useTestimonials();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("overview");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const tabBarRef = useRef<HTMLDivElement>(null);

  // Intersection observer for sticky tab bar
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px 0px 0px" }
    );
    const hero = document.getElementById("combo-hero-sentinel");
    if (hero) observer.observe(hero);
    return () => observer.disconnect();
  }, [combo]);

  // Active tab tracking via scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (const tab of [...tabs].reverse()) {
        const el = sectionRefs.current[tab.id];
        if (el && el.offsetTop <= scrollPos) {
          setActiveTab(tab.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const el = sectionRefs.current[id];
    if (el) {
      const offset = 160;
      window.scrollTo({ top: el.offsetTop - offset, behavior: "smooth" });
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: combo?.name, text: combo?.description || "", url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Share it with friends and family." });
    }
  };

  const reviews = useMemo(() => (testimonials || []).slice(0, 6), [testimonials]);
  const avgRating = useMemo(() => {
    if (!reviews.length) return 4.8;
    return +(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  }, [reviews]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen">
          <Skeleton className="h-[55vh] w-full" />
          <div className="container py-8">
            <Skeleton className="h-12 w-full rounded-xl mb-8" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {[1,2,3,4].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}
              </div>
              <Skeleton className="h-[500px] rounded-xl" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!combo) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <Sparkles className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Package Not Found</h1>
            <p className="text-muted-foreground mb-6">The combo package you're looking for doesn't exist.</p>
            <Link to="/combo-packages">
              <Button className="bg-secondary text-secondary-foreground rounded-xl">Browse All Packages</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const typeConfig = comboTypeConfig[combo.combo_type] || comboTypeConfig.essentials;
  const TypeIcon = typeConfig.icon;
  const savings = combo.base_price_aed - combo.final_price_aed;

  const inclusions = [
    { included: combo.includes_hotel, icon: Hotel, label: `${combo.hotel_star_rating || 4}-Star Hotel` },
    { included: combo.includes_transport, icon: Car, label: `${combo.transport_type || "Private"} Transport` },
    { included: true, icon: Ticket, label: "All Activities" },
    { included: combo.includes_visa, icon: FileText, label: "UAE Visa" },
  ].filter((item) => item.included);

  const filteredRelatedCombos = relatedCombos?.filter((c) => c.id !== combo.id).slice(0, 3);

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Combo Packages", url: "/combo-packages" },
    { name: combo.name, url: `/combo-packages/${combo.slug}` },
  ];

  const ratingDistribution = [
    { stars: 5, pct: 72 },
    { stars: 4, pct: 18 },
    { stars: 3, pct: 7 },
    { stars: 2, pct: 2 },
    { stars: 1, pct: 1 },
  ];

  return (
    <Layout>
      <SEOHead
        title={combo.meta_title || `${combo.name} – ${combo.duration_days} Days Dubai Combo Package`}
        description={combo.meta_description || `Book the ${combo.name}: ${combo.duration_days} days / ${combo.duration_nights} nights in Dubai. ${combo.description || ''} Starting from AED ${combo.final_price_aed}.`}
        canonical={`/combo-packages/${combo.slug}`}
        image={combo.image_url || undefined}
        type="product"
        keywords={["dubai combo package", combo.combo_type, `${combo.duration_days} day dubai`, "dubai tour bundle", "all inclusive dubai"]}
        structuredData={{
          ...createProductSchema({
            name: combo.name,
            description: combo.description || `${combo.duration_days}-day Dubai combo package`,
            image: combo.image_url || "/placeholder.svg",
            price: combo.final_price_aed,
            currency: "AED",
          }),
          ...createBreadcrumbSchema(breadcrumbs),
          ...createFAQSchema(faqs),
        }}
      />

      {/* ───── Cinematic Hero ───── */}
      <div className="relative h-[58vh] min-h-[450px] overflow-hidden" id="combo-hero-sentinel">
        <img src={combo.image_url || "/placeholder.svg"} alt={combo.name} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-transparent" />

        {/* Share / Wishlist floating buttons */}
        <div className="absolute top-24 right-4 md:right-8 flex flex-col gap-2 z-10">
          <Button
            size="icon"
            variant="ghost"
            className="bg-white/15 backdrop-blur-md hover:bg-white/25 text-white rounded-full h-10 w-10"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "backdrop-blur-md rounded-full h-10 w-10 transition-colors",
              isWishlisted ? "bg-red-500/80 hover:bg-red-500 text-white" : "bg-white/15 hover:bg-white/25 text-white"
            )}
            onClick={() => {
              setIsWishlisted(!isWishlisted);
              toast({ title: isWishlisted ? "Removed from wishlist" : "Saved to wishlist ❤️" });
            }}
          >
            <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
          </Button>
        </div>

        <div className="container relative h-full flex flex-col justify-end pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/combo-packages" className="hover:text-white transition-colors">Combo Packages</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80 line-clamp-1">{combo.name}</span>
          </nav>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-semibold backdrop-blur-sm ${typeConfig.color}`}>
                <TypeIcon className="w-3.5 h-3.5" />
                {typeConfig.label} Package
              </div>
              <Badge className="bg-white/15 text-white border-0 backdrop-blur-sm text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {combo.duration_days} Days / {combo.duration_nights} Nights
              </Badge>
              <Badge className="bg-white/15 text-white border-0 backdrop-blur-sm text-xs">
                <MapPin className="w-3 h-3 mr-1" />
                Dubai, UAE
              </Badge>
              {reviews.length > 0 && (
                <Badge className="bg-amber-500/20 text-amber-300 border-0 backdrop-blur-sm text-xs cursor-pointer" onClick={() => scrollToSection("reviews")}>
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  {avgRating} ({reviews.length} reviews)
                </Badge>
              )}
              {combo.discount_percent > 0 && (
                <Badge className="bg-destructive text-destructive-foreground text-xs font-bold animate-pulse">
                  Save {combo.discount_percent}%
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">{combo.name}</h1>
            <p className="text-white/60 text-lg max-w-2xl mb-5">{combo.description}</p>

            {/* Hero Price + CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-baseline gap-3">
                {combo.discount_percent > 0 && (
                  <span className="text-white/40 line-through text-lg">{formatPrice(combo.base_price_aed)}</span>
                )}
                <span className="text-3xl font-extrabold text-secondary">{formatPrice(combo.final_price_aed)}</span>
                <span className="text-white/50">/person</span>
              </div>
              <Button
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl h-11 px-6 font-bold hidden md:inline-flex"
                onClick={() => scrollToSection("pricing")}
              >
                View Pricing <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ───── Sticky Tab Navigation ───── */}
      <div
        ref={tabBarRef}
        className={cn(
          "sticky top-[64px] z-30 bg-card/95 backdrop-blur-lg border-b border-border/50 transition-shadow",
          stickyVisible && "shadow-md"
        )}
      >
        <div className="container">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-3 -mx-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                    isActive
                      ? "bg-secondary text-secondary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.id === "reviews" && reviews.length > 0 && (
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full",
                      isActive ? "bg-secondary-foreground/20" : "bg-muted-foreground/15"
                    )}>
                      {reviews.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ───── Quick Info Strip ───── */}
      <div className="bg-muted/30 pt-6 pb-16 lg:pb-24">
        <div className="container">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 -mt-8 relative z-10 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {inclusions.map((item, i) => (
              <Card key={i} className="bg-card/95 backdrop-blur-md border-border/50 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Included</p>
                    <p className="font-semibold text-sm">{item.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* ═══ Main Content ═══ */}
            <div className="lg:col-span-2 space-y-16">

              {/* ── OVERVIEW TAB ── */}
              <section ref={(el) => { sectionRefs.current.overview = el; }} id="section-overview" className="scroll-mt-40">
                {/* Quick Info Grid */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { icon: Clock, label: "Duration", value: `${combo.duration_days}D / ${combo.duration_nights}N` },
                      { icon: Hotel, label: "Hotel", value: combo.includes_hotel ? `${combo.hotel_star_rating || 4}-Star` : "Not Included" },
                      { icon: Car, label: "Transport", value: combo.includes_transport ? (combo.transport_type || "Private") : "Not Included" },
                      { icon: Ticket, label: "Activities", value: `${combo.items?.length || 0} Experiences` },
                    ].map((info, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 bg-muted/50 rounded-xl border border-border/50">
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                          <info.icon className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{info.label}</p>
                          <p className="text-sm font-semibold text-foreground">{info.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Gallery */}
                {combo.gallery && combo.gallery.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-secondary" /> Gallery
                    </h2>
                    <ComboGallery images={combo.gallery} name={combo.name} />
                  </motion.div>
                )}

                {/* Highlights */}
                {combo.highlights && combo.highlights.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-secondary" /> Package Highlights
                    </h2>
                    <div className="grid md:grid-cols-2 gap-3">
                      {combo.highlights.map((highlight, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.35 + idx * 0.05 }}
                          className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border/50 hover:border-secondary/30 hover:shadow-sm transition-all"
                        >
                          <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-3.5 h-3.5 text-secondary" />
                          </div>
                          <span className="text-sm text-muted-foreground leading-relaxed">{highlight}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Long Description */}
                {combo.long_description && combo.long_description !== combo.description && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
                    <h2 className="text-xl font-bold mb-4">About This Package</h2>
                    <Card className="border-border/50">
                      <CardContent className="p-6 text-muted-foreground leading-relaxed whitespace-pre-line">
                        {combo.long_description}
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Why Book This Combo */}
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="mt-8">
                  <h2 className="text-xl font-bold mb-4">Why Book This Combo?</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { icon: TrendingUp, title: `Save ${combo.discount_percent}%`, desc: "vs booking individually" },
                      { icon: Shield, title: "Best Price Guarantee", desc: "We'll match any lower price" },
                      { icon: CheckCircle, title: "Instant Confirmation", desc: "Confirmed in under 60s" },
                      { icon: Clock, title: "Free Cancellation", desc: "Cancel up to 24h before" },
                      { icon: Award, title: "Curated by Experts", desc: "Hand-picked experiences" },
                      { icon: Sparkles, title: "AI Customizable", desc: "Tailor it to your needs" },
                    ].map((item, i) => (
                      <Card key={i} className="border-border/50 hover:border-secondary/30 hover:shadow-sm transition-all group">
                        <CardContent className="p-4 text-center">
                          <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-secondary/20 transition-colors">
                            <item.icon className="w-5 h-5 text-secondary" />
                          </div>
                          <p className="font-semibold text-sm mb-0.5">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* ── ITINERARY TAB ── */}
              <section ref={(el) => { sectionRefs.current.itinerary = el; }} id="section-itinerary" className="scroll-mt-40">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-secondary" /> Day-by-Day Itinerary
                  </h2>
                  <Badge variant="outline" className="text-xs">
                    {combo.duration_days} Days · {combo.items?.length || 0} Activities
                  </Badge>
                </div>
                <ComboItinerary items={combo.items || []} totalDays={combo.duration_days} />
                
                {/* Customize CTA */}
                <Card className={cn("mt-6 border-0 bg-gradient-to-r", typeConfig.gradient)}>
                  <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">Want to customize this itinerary?</h3>
                      <p className="text-sm text-muted-foreground">Swap activities, extend days, or upgrade hotels with our AI Trip Planner.</p>
                    </div>
                    <Link to={`/plan-trip?combo=${combo.slug}`}>
                      <Button className="bg-secondary text-secondary-foreground rounded-xl font-semibold gap-2 whitespace-nowrap">
                        <Sparkles className="w-4 h-4" /> Customize Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </section>

              {/* ── PRICING TAB ── */}
              <section ref={(el) => { sectionRefs.current.pricing = el; }} id="section-pricing" className="scroll-mt-40">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-secondary" /> Pricing & Inclusions
                </h2>
                <ComboPricing combo={combo} />
              </section>

              {/* ── REVIEWS TAB ── */}
              <section ref={(el) => { sectionRefs.current.reviews = el; }} id="section-reviews" className="scroll-mt-40">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-secondary" /> Guest Reviews
                </h2>

                {/* Rating Summary */}
                <Card className="border-border/50 mb-6">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-[auto_1fr] gap-8">
                      {/* Big Score */}
                      <div className="text-center md:pr-8 md:border-r border-border/50">
                        <p className="text-5xl font-extrabold text-foreground">{avgRating}</p>
                        <div className="flex items-center justify-center gap-0.5 my-2">
                          {[1,2,3,4,5].map(s => (
                            <Star key={s} className={cn("w-4 h-4", s <= Math.round(avgRating) ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30")} />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">{reviews.length} reviews</p>
                      </div>
                      {/* Distribution */}
                      <div className="space-y-2">
                        {ratingDistribution.map((r) => (
                          <div key={r.stars} className="flex items-center gap-3">
                            <span className="text-sm w-12 text-muted-foreground">{r.stars} star</span>
                            <Progress value={r.pct} className="h-2 flex-1" />
                            <span className="text-xs text-muted-foreground w-10 text-right">{r.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Review Cards */}
                {reviews.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {reviews.map((review, idx) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card className="border-border/50 h-full hover:shadow-sm transition-shadow">
                          <CardContent className="p-5">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-sm">
                                {review.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate">{review.name}</p>
                                <p className="text-xs text-muted-foreground">{review.date}</p>
                              </div>
                              <div className="flex items-center gap-0.5">
                                {[1,2,3,4,5].map(s => (
                                  <Star key={s} className={cn("w-3 h-3", s <= review.rating ? "text-amber-500 fill-amber-500" : "text-muted-foreground/20")} />
                                ))}
                              </div>
                            </div>
                            {review.title && <p className="font-medium text-sm mb-1">{review.title}</p>}
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{review.content}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <Card className="border-border/50">
                    <CardContent className="p-8 text-center">
                      <Quote className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
                      <p className="text-muted-foreground">No reviews yet. Be the first to experience this package!</p>
                    </CardContent>
                  </Card>
                )}
              </section>

              {/* ── FAQ TAB ── */}
              <section ref={(el) => { sectionRefs.current.faq = el; }} id="section-faq" className="scroll-mt-40">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-secondary" /> Frequently Asked Questions
                </h2>
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
              </section>
            </div>

            {/* ═══ Sidebar ═══ */}
            <div className="space-y-6">
              <ComboBookingCard combo={combo} />

              {/* Need Help Card */}
              <Card className="border-border/50 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-5 text-center">
                    <MessageCircle className="w-8 h-8 text-secondary mx-auto mb-2" />
                    <h3 className="font-bold text-sm mb-1">Need Help Deciding?</h3>
                    <p className="text-xs text-muted-foreground mb-4">Our travel experts are available 24/7</p>
                    <div className="space-y-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full rounded-xl text-xs"
                        onClick={() => {
                          const msg = encodeURIComponent(`Hi! I have questions about the "${combo.name}" combo package.`);
                          window.open(`https://wa.me/${whatsapp}?text=${msg}`, "_blank");
                        }}
                      >
                        <MessageCircle className="w-3.5 h-3.5 mr-1.5" /> Chat on WhatsApp
                      </Button>
                      {phone && (
                        <Button size="sm" variant="ghost" className="w-full rounded-xl text-xs text-muted-foreground" onClick={() => window.open(`tel:${phone}`, "_self")}>
                          <Phone className="w-3.5 h-3.5 mr-1.5" /> Call Us
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ───── Related Packages ───── */}
          {filteredRelatedCombos && filteredRelatedCombos.length > 0 && (
            <motion.section className="mt-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Similar Packages</h2>
                <Link to="/combo-packages" className="text-secondary font-medium flex items-center gap-1 hover:underline text-sm">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRelatedCombos.map((relatedCombo, i) => (
                  <motion.div key={relatedCombo.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 + i * 0.1 }}>
                    <ComboCard combo={relatedCombo} />
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>

      {/* ───── Mobile Sticky CTA ───── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-card/95 backdrop-blur-lg border-t border-border/50 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div>
            <div className="flex items-baseline gap-1.5">
              {combo.discount_percent > 0 && (
                <span className="text-xs text-muted-foreground line-through">AED {combo.base_price_aed.toLocaleString()}</span>
              )}
              <span className="text-xl font-extrabold text-secondary">AED {combo.final_price_aed.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-muted-foreground">/person · {combo.duration_days} Days</p>
          </div>
          <Button
            onClick={() => document.querySelector<HTMLButtonElement>('[data-combo-book]')?.click()}
            className="bg-secondary text-secondary-foreground font-bold rounded-xl h-11 px-6"
          >
            Book Now <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
      <div className="h-20 lg:hidden" />
    </Layout>
  );
};

export default ComboPackageDetail;
