import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Clock, Hotel, Car, Ticket, FileText, MapPin, Users, Heart, Mountain, Crown, Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ComboItinerary from "@/components/combo/ComboItinerary";
import ComboPricing from "@/components/combo/ComboPricing";
import ComboBookingCard from "@/components/combo/ComboBookingCard";
import ComboCard from "@/components/combo/ComboCard";
import { useComboPackageWithItems, useComboPackages } from "@/hooks/useComboPackages";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const comboTypeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  essentials: { icon: Sparkles, color: "bg-blue-500", label: "Essentials" },
  family: { icon: Users, color: "bg-green-500", label: "Family" },
  couple: { icon: Heart, color: "bg-pink-500", label: "Romantic" },
  adventure: { icon: Mountain, color: "bg-orange-500", label: "Adventure" },
  luxury: { icon: Crown, color: "bg-amber-500", label: "Luxury" },
};

const ComboPackageDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: combo, isLoading } = useComboPackageWithItems(slug || "");
  const { data: relatedCombos } = useComboPackages({ type: combo?.combo_type, activeOnly: true });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="aspect-[21/9] rounded-xl mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-64" />
              <Skeleton className="h-96" />
            </div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!combo) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Package Not Found</h1>
          <p className="text-muted-foreground mb-6">The combo package you're looking for doesn't exist.</p>
          <Link to="/combo-packages" className="text-secondary hover:underline">
            Browse All Packages
          </Link>
        </div>
      </Layout>
    );
  }

  const typeConfig = comboTypeConfig[combo.combo_type] || comboTypeConfig.essentials;
  const TypeIcon = typeConfig.icon;

  const inclusions = [
    { included: combo.includes_hotel, icon: Hotel, label: `${combo.hotel_star_rating || 4}-Star Hotel` },
    { included: combo.includes_transport, icon: Car, label: `${combo.transport_type || "Sedan"} Transport` },
    { included: true, icon: Ticket, label: "All Activities" },
    { included: combo.includes_visa, icon: FileText, label: "UAE Visa" },
  ].filter((item) => item.included);

  const filteredRelatedCombos = relatedCombos?.filter((c) => c.id !== combo.id).slice(0, 3);

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b border-border">
        <div className="container py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/combo-packages" className="hover:text-foreground transition-colors">Combo Packages</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{combo.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="aspect-[21/9] md:aspect-[21/7] relative overflow-hidden">
          <img
            src={combo.image_url || "/placeholder.svg"}
            alt={combo.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="container">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-medium mb-4 ${typeConfig.color}`}>
                <TypeIcon className="w-4 h-4" />
                {typeConfig.label} Package
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-3">
                {combo.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  <Clock className="w-3 h-3 mr-1" />
                  {combo.duration_days} Days / {combo.duration_nights} Nights
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  <MapPin className="w-3 h-3 mr-1" />
                  Dubai
                </Badge>
                {combo.discount_percent > 0 && (
                  <Badge className="bg-destructive text-destructive-foreground">
                    Save {combo.discount_percent}%
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">About This Package</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {combo.long_description || combo.description}
                </p>
              </motion.div>

              {/* What's Included */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">What's Included</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {inclusions.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-center p-4 bg-muted/50 rounded-xl"
                    >
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                        <item.icon className="w-6 h-6 text-secondary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Highlights */}
              {combo.highlights && combo.highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                >
                  <h2 className="text-2xl font-bold text-foreground mb-4">Package Highlights</h2>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {combo.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="w-2 h-2 rounded-full bg-secondary" />
                        </div>
                        <span className="text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Day-by-Day Itinerary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">Day-by-Day Itinerary</h2>
                <ComboItinerary items={combo.items || []} totalDays={combo.duration_days} />
              </motion.div>

              {/* Pricing Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25 }}
              >
                <ComboPricing combo={combo} />
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ComboBookingCard combo={combo} />
            </div>
          </div>
        </div>
      </section>

      {/* Related Packages */}
      {filteredRelatedCombos && filteredRelatedCombos.length > 0 && (
        <section className="py-10 md:py-14 bg-muted/30 border-t border-border">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground mb-8">Similar Packages</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRelatedCombos.map((relatedCombo) => (
                <ComboCard key={relatedCombo.id} combo={relatedCombo} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

export default ComboPackageDetail;
