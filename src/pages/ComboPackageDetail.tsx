import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ChevronRight, Clock, Hotel, Car, Ticket, FileText, MapPin, Users, Heart, Mountain, Crown, Sparkles,
  Shield, CheckCircle, Star, ArrowRight, MessageCircle, Phone, Award, TrendingUp
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import ComboItinerary from "@/components/combo/ComboItinerary";
import ComboPricing from "@/components/combo/ComboPricing";
import ComboBookingCard from "@/components/combo/ComboBookingCard";
import ComboCard from "@/components/combo/ComboCard";
import ComboGallery from "@/components/combo/ComboGallery";
import ComboQuickInfo from "@/components/combo/ComboQuickInfo";
import SEOHead, { createProductSchema, createBreadcrumbSchema, createFAQSchema } from "@/components/SEOHead";
import { useComboPackageWithItems, useComboPackages } from "@/hooks/useComboPackages";
import { useCurrency } from "@/hooks/useCurrency";
import { useContactConfig } from "@/hooks/useContactConfig";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const comboTypeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  essentials: { icon: Sparkles, color: "bg-secondary", label: "Essentials" },
  family: { icon: Users, color: "bg-green-500", label: "Family" },
  couple: { icon: Heart, color: "bg-pink-500", label: "Romantic" },
  adventure: { icon: Mountain, color: "bg-orange-500", label: "Adventure" },
  luxury: { icon: Crown, color: "bg-amber-500", label: "Luxury" },
};

const faqs = [
  {
    question: "Can I customize this combo package?",
    answer: "Absolutely! Use our AI Trip Planner to swap activities, upgrade hotels, extend your stay, or adjust the itinerary to match your preferences. Real-time pricing updates as you customize."
  },
  {
    question: "What happens if I need to cancel?",
    answer: "Free cancellation is available up to 24 hours before your trip starts. After that, a partial refund may apply depending on the specific services booked. Full details are shared upon confirmation."
  },
  {
    question: "Are meals included in the package?",
    answer: "Meal inclusions vary by package. Some activities include meals (like dinner cruises or desert safari BBQ). Hotel breakfast is typically included with 4-5 star accommodations. Check the itinerary for details."
  },
  {
    question: "Is airport transfer included?",
    answer: "Yes, all packages with transport include complimentary airport pickup and drop-off. We'll have a driver waiting for you at arrivals with a name board."
  },
  {
    question: "Can I book for a large group?",
    answer: "Yes! We accommodate groups of all sizes. For groups of 6+, contact us for special group pricing and customized arrangements. We can tailor the entire experience for your group."
  },
];

const ComboPackageDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: combo, isLoading } = useComboPackageWithItems(slug || "");
  const { data: relatedCombos } = useComboPackages({ type: combo?.combo_type, activeOnly: true });
  const { formatPrice } = useCurrency();
  const { whatsapp, phone } = useContactConfig();

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen">
          <Skeleton className="h-[50vh] w-full" />
          <div className="container py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-4 gap-3">
                  {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
                </div>
                <Skeleton className="h-40 rounded-xl" />
                <Skeleton className="h-64 rounded-xl" />
                <Skeleton className="h-96 rounded-xl" />
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
              <Button className="bg-secondary text-secondary-foreground rounded-xl">
                Browse All Packages
              </Button>
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

      {/* Cinematic Hero */}
      <div className="relative h-[55vh] min-h-[420px] overflow-hidden">
        <img
          src={combo.image_url || "/placeholder.svg"}
          alt={combo.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-transparent" />

        <div className="container relative h-full flex flex-col justify-end pb-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/50 mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/combo-packages" className="hover:text-white transition-colors">Combo Packages</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">{combo.name}</span>
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
              {combo.discount_percent > 0 && (
                <Badge className="bg-destructive text-destructive-foreground text-xs font-bold">
                  Save {combo.discount_percent}%
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 leading-tight">{combo.name}</h1>
            <p className="text-white/60 text-lg max-w-2xl mb-5">{combo.description}</p>

            {/* Price in hero */}
            <div className="flex items-baseline gap-3">
              {combo.discount_percent > 0 && (
                <span className="text-white/40 line-through text-lg">AED {combo.base_price_aed.toLocaleString()}</span>
              )}
              <span className="text-3xl font-extrabold text-secondary">AED {combo.final_price_aed.toLocaleString()}</span>
              <span className="text-white/50">/person</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-muted/30 pb-16 lg:pb-24">
        <div className="container">
          {/* Quick Info Strip */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 -mt-8 relative z-10 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {inclusions.map((item, i) => (
              <Card key={i} className="bg-card/95 backdrop-blur-md border-border/50 shadow-lg">
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
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Quick Info */}
              <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <ComboQuickInfo combo={combo} />
              </motion.section>

              {/* Gallery */}
              {combo.gallery && combo.gallery.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-secondary" /> Gallery
                  </h2>
                  <ComboGallery images={combo.gallery} name={combo.name} />
                </motion.section>
              )}

              {/* Highlights */}
              {combo.highlights && combo.highlights.length > 0 && (
                <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" /> Package Highlights
                  </h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {combo.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-card p-4 rounded-xl border border-border/50 hover:border-secondary/30 transition-colors">
                        <div className="w-6 h-6 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <CheckCircle className="w-3.5 h-3.5 text-secondary" />
                        </div>
                        <span className="text-sm text-muted-foreground leading-relaxed">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Day-by-Day Itinerary */}
              <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary" /> Day-by-Day Itinerary
                </h2>
                <ComboItinerary items={combo.items || []} totalDays={combo.duration_days} />
              </motion.section>

              {/* Pricing Breakdown */}
              <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                <ComboPricing combo={combo} />
              </motion.section>

              {/* About / Long Description */}
              {combo.long_description && combo.long_description !== combo.description && (
                <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <h2 className="text-xl font-bold mb-4">About This Package</h2>
                  <Card className="border-border/50">
                    <CardContent className="p-6 text-muted-foreground leading-relaxed">
                      {combo.long_description}
                    </CardContent>
                  </Card>
                </motion.section>
              )}

              {/* Why Book This Combo */}
              <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
                <h2 className="text-xl font-bold mb-4">Why Book This Combo?</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { icon: TrendingUp, title: `Save ${combo.discount_percent}%`, desc: "vs booking individually" },
                    { icon: Shield, title: "Best Price Guarantee", desc: "We'll match any lower price" },
                    { icon: CheckCircle, title: "Instant Confirmation", desc: "Confirmed in under 60 seconds" },
                    { icon: Clock, title: "Free Cancellation", desc: "Cancel up to 24h before" },
                    { icon: Award, title: "Curated by Experts", desc: "Hand-picked experiences" },
                    { icon: Sparkles, title: "AI Customizable", desc: "Tailor it to your needs" },
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
              <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
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

          {/* Related Packages */}
          {filteredRelatedCombos && filteredRelatedCombos.length > 0 && (
            <motion.section
              className="mt-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Similar Packages</h2>
                <Link to="/combo-packages" className="text-secondary font-medium flex items-center gap-1 hover:underline text-sm">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRelatedCombos.map((relatedCombo, i) => (
                  <motion.div
                    key={relatedCombo.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75 + i * 0.1 }}
                  >
                    <ComboCard combo={relatedCombo} />
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

      {/* Spacer for mobile sticky bar */}
      <div className="h-20 lg:hidden" />
    </Layout>
  );
};

export default ComboPackageDetail;
