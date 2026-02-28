import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Hotel,
  Car,
  Plane,
  Star,
  Plus,
  Share2,
  Download,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  UtensilsCrossed,
  Navigation,
  Activity,
  Shield,
  Award,
  ArrowLeft,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/hooks/useCurrency';
import CurrencySelector from '@/components/trip/CurrencySelector';
import { supabase } from '@/integrations/supabase/client';

interface TripItem {
  id: string;
  day_number: number;
  item_type: string;
  item_id: string | null;
  title: string;
  description: string | null;
  start_time: string | null;
  end_time: string | null;
  price_aed: number;
  quantity: number;
  is_optional: boolean;
  is_included: boolean;
  sort_order: number;
  metadata: unknown;
}

interface TripPlan {
  id: string;
  visitor_id: string;
  status: string;
  destination: string;
  arrival_date: string;
  departure_date: string;
  total_days: number;
  travelers_adults: number;
  travelers_children: number;
  nationality: string;
  budget_tier: string;
  travel_style: string;
  special_occasion: string | null;
  total_price_aed: number;
  display_currency: string;
  display_price: number;
  metadata: unknown;
}

const TripItinerary = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  
  const [trip, setTrip] = useState<TripPlan | null>(null);
  const [items, setItems] = useState<TripItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDays, setExpandedDays] = useState<number[]>([]);
  const [includedUpsells, setIncludedUpsells] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!tripId) {
      navigate('/plan-trip');
      return;
    }

    const loadTrip = async () => {
      try {
        const { data: tripData, error: tripError } = await supabase
          .from('trip_plans')
          .select('*')
          .eq('id', tripId)
          .single();

        if (tripError) throw tripError;

        const { data: itemsData, error: itemsError } = await supabase
          .from('trip_items')
          .select('*')
          .eq('trip_id', tripId)
          .order('day_number')
          .order('sort_order');

        if (itemsError) throw itemsError;

        setTrip(tripData);
        setItems(itemsData || []);
        
        if (tripData?.total_days > 0) {
          setExpandedDays([1]);
        }
      } catch (error) {
        console.error('Failed to load trip:', error);
        navigate('/plan-trip');
      } finally {
        setIsLoading(false);
      }
    };

    loadTrip();
  }, [tripId, navigate]);

  const itemsByDay = items.reduce<Record<number, TripItem[]>>((acc, item) => {
    const day = item.day_number;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  const hotelItem = items.find(i => i.item_type === 'hotel');
  const transportItem = items.find(i => i.item_type === 'car');
  const visaItem = items.find(i => i.item_type === 'visa');
  const upsells = items.filter(i => i.item_type === 'upsell');

  const baseTotal = trip?.total_price_aed || 0;
  const upsellTotal = upsells
    .filter(u => includedUpsells.has(u.id))
    .reduce((sum, u) => sum + u.price_aed, 0);
  const grandTotal = baseTotal + upsellTotal;

  const toggleDay = (day: number) => {
    setExpandedDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const toggleUpsell = (id: string) => {
    setIncludedUpsells(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDownloadPDF = () => {
    const previousExpanded = [...expandedDays];
    const allDays = Array.from({ length: trip?.total_days || 0 }, (_, i) => i + 1);
    setExpandedDays(allDays);
    setTimeout(() => {
      window.print();
      setTimeout(() => setExpandedDays(previousExpanded), 500);
    }, 150);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'transfer': return <Navigation className="w-4 h-4" />;
      case 'activity': return <Activity className="w-4 h-4" />;
      case 'tour': return <Star className="w-4 h-4" />;
      case 'meal': return <UtensilsCrossed className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'transfer': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'activity': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'tour': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      case 'meal': return 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-secondary/5">
          <div className="container max-w-6xl py-10 space-y-6">
            <Skeleton className="h-56 w-full rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-36 rounded-2xl" />
              <Skeleton className="h-36 rounded-2xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!trip) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-secondary/5 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto">
              <MapPin className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Trip Not Found</h1>
            <p className="text-muted-foreground">This trip doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/plan-trip')} className="gap-2 rounded-xl">
              <ArrowLeft className="w-4 h-4" />
              Plan a New Trip
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const activitiesTotal = items
    .filter(i => ['activity', 'tour', 'transfer', 'meal'].includes(i.item_type))
    .reduce((sum, i) => sum + i.price_aed, 0);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-secondary/5 relative overflow-hidden">
        {/* Background decorations matching wizard */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        </div>

        {/* Hero Header */}
        <div className="relative bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
          </div>

          <div className="container max-w-6xl relative py-10 md:py-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Back link */}
              <button
                onClick={() => navigate('/plan-trip')}
                className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Planner
              </button>

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/25 text-xs font-semibold tracking-wide backdrop-blur-sm">
                      {trip.budget_tier.charAt(0).toUpperCase() + trip.budget_tier.slice(1)}
                    </Badge>
                    <Badge className="bg-white/15 text-white border-white/20 hover:bg-white/25 text-xs font-semibold tracking-wide backdrop-blur-sm">
                      {trip.travel_style.charAt(0).toUpperCase() + trip.travel_style.slice(1)}
                    </Badge>
                    {trip.special_occasion && trip.special_occasion !== 'none' && (
                      <Badge className="bg-secondary/80 text-secondary-foreground border-secondary/50 text-xs font-semibold">
                        🎉 {trip.special_occasion.charAt(0).toUpperCase() + trip.special_occasion.slice(1)}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                    Your {trip.total_days}-Day Dubai Adventure
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm border border-white/10">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(trip.arrival_date), 'MMM d')} – {format(new Date(trip.departure_date), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm border border-white/10">
                      <Users className="w-4 h-4" />
                      {trip.travelers_adults} Adult{trip.travelers_adults !== 1 ? 's' : ''}
                      {trip.travelers_children > 0 && `, ${trip.travelers_children} Child${trip.travelers_children !== 1 ? 'ren' : ''}`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <CurrencySelector compact variant="hero" />
                  <Button variant="secondary" size="sm" className="gap-2 rounded-xl h-10">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="gap-2 rounded-xl h-10 print-visible"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="container max-w-6xl py-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Essentials Cards */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {hotelItem && (
                  <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors shrink-0">
                        <Hotel className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Accommodation</p>
                        <h3 className="font-bold mt-0.5 truncate">{hotelItem.title}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{hotelItem.quantity} nights</p>
                        <p className="text-secondary font-bold mt-2">{formatPrice(hotelItem.price_aed)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {transportItem && (
                  <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors shrink-0">
                        <Car className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Transport</p>
                        <h3 className="font-bold mt-0.5 truncate">{transportItem.title}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{transportItem.quantity} days</p>
                        <p className="text-secondary font-bold mt-2">{formatPrice(transportItem.price_aed)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Visa Notice */}
              {visaItem && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl p-4 flex items-center gap-4"
                >
                  <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                    <Plane className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-amber-800 dark:text-amber-200">{visaItem.title}</h3>
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      Included in your trip • {formatPrice(visaItem.price_aed)}
                    </p>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
                  </div>
                </motion.div>
              )}

              {/* Day-by-Day Itinerary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2.5">
                    <span className="w-1 h-6 bg-secondary rounded-full" />
                    Day-by-Day Itinerary
                  </h2>
                  <button
                    onClick={() => {
                      const allDays = Array.from({ length: trip.total_days }, (_, i) => i + 1);
                      setExpandedDays(expandedDays.length === trip.total_days ? [1] : allDays);
                    }}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {expandedDays.length === trip.total_days ? 'Collapse All' : 'Expand All'}
                  </button>
                </div>

                <div className="space-y-3">
                  {Array.from({ length: trip.total_days }, (_, i) => i + 1).map((day) => {
                    const dayItems = itemsByDay[day]?.filter(i => 
                      !['hotel', 'car', 'visa', 'upsell'].includes(i.item_type)
                    ) || [];
                    const isExpanded = expandedDays.includes(day);
                    const dayDate = new Date(trip.arrival_date);
                    dayDate.setDate(dayDate.getDate() + day - 1);

                    return (
                      <Collapsible key={day} open={isExpanded}>
                        <div className={cn(
                          "bg-card rounded-2xl border overflow-hidden transition-all",
                          isExpanded ? "border-border shadow-md" : "border-border/50 shadow-sm hover:shadow-md"
                        )}>
                          <CollapsibleTrigger
                            onClick={() => toggleDay(day)}
                            className="w-full p-4 md:p-5 flex items-center justify-between hover:bg-muted/20 transition-colors"
                          >
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground flex flex-col items-center justify-center shadow-sm">
                                <span className="text-[9px] font-bold uppercase tracking-widest opacity-70">Day</span>
                                <span className="text-lg md:text-xl font-bold -mt-0.5">{day}</span>
                              </div>
                              <div className="text-left">
                                <h3 className="font-bold text-sm md:text-base">
                                  {day === 1
                                    ? 'Arrival Day'
                                    : day === trip.total_days
                                    ? 'Departure Day'
                                    : format(dayDate, 'EEEE')}
                                </h3>
                                <p className="text-xs md:text-sm text-muted-foreground">
                                  {format(dayDate, 'MMM d, yyyy')} • {dayItems.length} {dayItems.length === 1 ? 'activity' : 'activities'}
                                </p>
                              </div>
                            </div>
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                              isExpanded ? "bg-primary/10 rotate-0" : "bg-muted"
                            )}>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-primary" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="px-4 md:px-5 pb-5 pt-1 border-t border-border/50">
                              {dayItems.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-8 text-center italic">
                                  {day === trip.total_days
                                    ? 'Free time for packing & airport transfer'
                                    : 'Free day to explore on your own'}
                                </p>
                              ) : (
                                <div className="relative pl-6 mt-3">
                                  {/* Timeline line */}
                                  <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-border/60 rounded-full" />
                                  
                                  <div className="space-y-1">
                                    {dayItems.map((item, idx) => (
                                      <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="relative flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors group"
                                      >
                                        {/* Timeline dot */}
                                        <div className={cn(
                                          "absolute -left-6 top-5 w-4 h-4 rounded-full border-2 border-card flex items-center justify-center z-10",
                                          getItemColor(item.item_type)
                                        )}>
                                          <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                        </div>

                                        <div className={cn(
                                          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                                          getItemColor(item.item_type)
                                        )}>
                                          {getItemIcon(item.item_type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                              <h4 className="font-semibold text-sm">{item.title}</h4>
                                              {item.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                                  {item.description}
                                                </p>
                                              )}
                                            </div>
                                            {item.price_aed > 0 && (
                                              <span className="text-xs font-bold text-secondary shrink-0 bg-secondary/10 px-2 py-0.5 rounded-full">
                                                {formatPrice(item.price_aed)}
                                              </span>
                                            )}
                                          </div>
                                          {item.start_time && (
                                            <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-muted-foreground">
                                              <Clock className="w-3 h-3" />
                                              {item.start_time}
                                              {item.end_time && ` – ${item.end_time}`}
                                            </div>
                                          )}
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Price Summary */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden sticky top-24"
              >
                {/* Gradient header */}
                <div className="bg-gradient-to-r from-primary to-primary/80 p-5 text-primary-foreground">
                  <p className="text-xs font-medium text-primary-foreground/70 uppercase tracking-wider">Total Trip Cost</p>
                  <p className="text-3xl font-bold mt-1">{formatPrice(grandTotal)}</p>
                  <p className="text-xs text-primary-foreground/60 mt-1">
                    {formatPrice(grandTotal / (trip.travelers_adults + trip.travelers_children))} per person
                  </p>
                </div>

                <div className="p-5 space-y-3 text-sm">
                  {hotelItem && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Hotel className="w-3.5 h-3.5" />
                        Hotel ({hotelItem.quantity}N)
                      </span>
                      <span className="font-medium">{formatPrice(hotelItem.price_aed)}</span>
                    </div>
                  )}
                  {transportItem && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Car className="w-3.5 h-3.5" />
                        Transport
                      </span>
                      <span className="font-medium">{formatPrice(transportItem.price_aed)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-1">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5" />
                      Activities
                    </span>
                    <span className="font-medium">{formatPrice(activitiesTotal)}</span>
                  </div>
                  {visaItem && (
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Plane className="w-3.5 h-3.5" />
                        Visa
                      </span>
                      <span className="font-medium">{formatPrice(visaItem.price_aed)}</span>
                    </div>
                  )}
                  
                  {includedUpsells.size > 0 && (
                    <div className="flex justify-between items-center text-secondary py-1">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        Add-ons
                      </span>
                      <span className="font-medium">+{formatPrice(upsellTotal)}</span>
                    </div>
                  )}
                </div>

                <div className="px-5 pb-5 space-y-3">
                  <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl h-12 text-base font-semibold shadow-lg shadow-secondary/20" size="lg">
                    Book This Trip
                  </Button>

                  <Button variant="outline" className="w-full gap-2 rounded-xl h-11 border-border/50">
                    <MessageCircle className="w-4 h-4" />
                    Chat with Agent
                  </Button>
                </div>

                {/* Trust markers */}
                <div className="px-5 pb-5 flex flex-col gap-2">
                  {[
                    { icon: Shield, label: 'Best Price Guarantee' },
                    { icon: Award, label: 'Free Cancellation' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Icon className="w-3.5 h-3.5 text-secondary" />
                      {label}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Upsells */}
              {upsells.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card rounded-2xl border border-border/50 shadow-sm p-5"
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-secondary" />
                    </div>
                    <h3 className="font-bold text-sm">Recommended for You</h3>
                  </div>
                  
                  <div className="space-y-2.5">
                    {upsells.map((upsell) => {
                      const isIncluded = includedUpsells.has(upsell.id);
                      return (
                        <button
                          key={upsell.id}
                          onClick={() => toggleUpsell(upsell.id)}
                          className={cn(
                            'w-full p-3.5 rounded-xl border-2 text-left transition-all',
                            isIncluded
                              ? 'border-secondary bg-secondary/5 shadow-sm'
                              : 'border-border/50 hover:border-secondary/30 hover:bg-muted/20'
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm">{upsell.title}</h4>
                              <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                                {upsell.description}
                              </p>
                              <p className="text-secondary font-bold text-sm mt-1.5">
                                +{formatPrice(upsell.price_aed)}
                              </p>
                            </div>
                            <div
                              className={cn(
                                'w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all mt-0.5',
                                isIncluded
                                  ? 'bg-secondary text-secondary-foreground'
                                  : 'border-2 border-muted-foreground/20'
                              )}
                            >
                              {isIncluded ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Bottom trust badges matching wizard */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap justify-center gap-3 md:gap-5 pb-10"
          >
            {[
              { label: 'AI-Powered Planning', icon: Sparkles },
              { label: 'Best Price Guaranteed', icon: Shield },
              { label: '24/7 Support', icon: MessageCircle },
            ].map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 text-xs text-muted-foreground bg-card px-4 py-2 rounded-full border border-border/50"
              >
                <badge.icon className="w-3.5 h-3.5 text-secondary" />
                {badge.label}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default TripItinerary;
