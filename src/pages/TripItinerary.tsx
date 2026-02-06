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
      case 'transfer':
        return <Navigation className="w-4 h-4" />;
      case 'activity':
        return <Activity className="w-4 h-4" />;
      case 'tour':
        return <Star className="w-4 h-4" />;
      case 'meal':
        return <UtensilsCrossed className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'transfer':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400';
      case 'activity':
        return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'tour':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400';
      case 'meal':
        return 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-10 space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-36 rounded-xl" />
            <Skeleton className="h-36 rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </Layout>
    );
  }

  if (!trip) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Trip Not Found</h1>
          <Button onClick={() => navigate('/plan-trip')}>Plan a New Trip</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        {/* Hero Header */}
        <div className="relative bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
          </div>

          <div className="container relative py-10 md:py-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
            >
              <div>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 mb-3 text-xs font-semibold tracking-wide">
                  {trip.budget_tier.charAt(0).toUpperCase() + trip.budget_tier.slice(1)} • {trip.travel_style.charAt(0).toUpperCase() + trip.travel_style.slice(1)}
                </Badge>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                  Your {trip.total_days}-Day Dubai Adventure
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                  <span className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(trip.arrival_date), 'MMM d')} - {format(new Date(trip.departure_date), 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                    <Users className="w-4 h-4" />
                    {trip.travelers_adults + trip.travelers_children} Travelers
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
            </motion.div>
          </div>
        </div>

        <div className="container py-8">
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
                  <div className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Hotel className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Accommodation</p>
                        <h3 className="font-bold text-lg mt-0.5">{hotelItem.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {hotelItem.quantity} nights
                        </p>
                        <p className="text-secondary font-bold text-lg mt-2">
                          {formatPrice(hotelItem.price_aed)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {transportItem && (
                  <div className="bg-card rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow group">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Car className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Transport</p>
                        <h3 className="font-bold text-lg mt-0.5">{transportItem.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {transportItem.quantity} days
                        </p>
                        <p className="text-secondary font-bold text-lg mt-2">
                          {formatPrice(transportItem.price_aed)}
                        </p>
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
                  className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0">
                    <Plane className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-800 dark:text-amber-200">
                      {visaItem.title}
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Included in your trip • {formatPrice(visaItem.price_aed)}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center">
                    <Check className="w-4 h-4 text-amber-700 dark:text-amber-300" />
                  </div>
                </motion.div>
              )}

              {/* Day-by-Day Itinerary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-7 bg-secondary rounded-full" />
                  Your Day-by-Day Itinerary
                </h2>
                <div className="space-y-4">
                  {Array.from({ length: trip.total_days }, (_, i) => i + 1).map((day) => {
                    const dayItems = itemsByDay[day]?.filter(i => 
                      !['hotel', 'car', 'visa', 'upsell'].includes(i.item_type)
                    ) || [];
                    const isExpanded = expandedDays.includes(day);
                    const dayDate = new Date(trip.arrival_date);
                    dayDate.setDate(dayDate.getDate() + day - 1);

                    return (
                      <Collapsible key={day} open={isExpanded}>
                        <div className="bg-card rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          <CollapsibleTrigger
                            onClick={() => toggleDay(day)}
                            className="w-full p-5 flex items-center justify-between hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground flex flex-col items-center justify-center shadow-md shadow-secondary/20">
                                <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">Day</span>
                                <span className="text-xl font-bold -mt-0.5">{day}</span>
                              </div>
                              <div className="text-left">
                                <h3 className="font-bold text-base">
                                  {day === 1
                                    ? 'Arrival Day'
                                    : day === trip.total_days
                                    ? 'Departure Day'
                                    : format(dayDate, 'EEEE')}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {format(dayDate, 'MMM d, yyyy')} • {dayItems.length} {dayItems.length === 1 ? 'activity' : 'activities'}
                                </p>
                              </div>
                            </div>
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                              isExpanded ? "bg-primary/10" : "bg-muted"
                            )}>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-primary" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="px-5 pb-5 pt-2 space-y-3 border-t">
                              {dayItems.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-6 text-center italic">
                                  {day === trip.total_days
                                    ? 'Free time for packing & airport transfer'
                                    : 'Free day to explore on your own'}
                                </p>
                              ) : (
                                dayItems.map((item, idx) => (
                                  <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 border border-transparent hover:border-border/50 transition-all"
                                  >
                                    <div className={cn(
                                      "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                      getItemColor(item.item_type)
                                    )}>
                                      {getItemIcon(item.item_type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <div>
                                          <h4 className="font-semibold text-sm">{item.title}</h4>
                                          {item.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                                              {item.description}
                                            </p>
                                          )}
                                        </div>
                                        {item.price_aed > 0 && (
                                          <span className="text-sm font-bold text-secondary shrink-0">
                                            {formatPrice(item.price_aed)}
                                          </span>
                                        )}
                                      </div>
                                      {item.start_time && (
                                        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                                          <Clock className="w-3.5 h-3.5" />
                                          {item.start_time}
                                          {item.end_time && ` - ${item.end_time}`}
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                ))
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
            <div className="space-y-6">
              {/* Price Summary */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-card rounded-2xl border shadow-sm p-6 sticky top-24"
              >
                <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-primary rounded-full" />
                  Trip Summary
                </h3>
                
                <div className="space-y-3 text-sm">
                  {hotelItem && (
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Hotel ({hotelItem.quantity} nights)</span>
                      <span className="font-medium">{formatPrice(hotelItem.price_aed)}</span>
                    </div>
                  )}
                  {transportItem && (
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Transport</span>
                      <span className="font-medium">{formatPrice(transportItem.price_aed)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Activities & Tours</span>
                    <span className="font-medium">
                      {formatPrice(
                        items
                          .filter(i => ['activity', 'tour', 'transfer'].includes(i.item_type))
                          .reduce((sum, i) => sum + i.price_aed, 0)
                      )}
                    </span>
                  </div>
                  {visaItem && (
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Visa</span>
                      <span className="font-medium">{formatPrice(visaItem.price_aed)}</span>
                    </div>
                  )}
                  
                  {includedUpsells.size > 0 && (
                    <div className="flex justify-between text-secondary py-1">
                      <span>Add-ons</span>
                      <span className="font-medium">+{formatPrice(upsellTotal)}</span>
                    </div>
                  )}

                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-secondary">{formatPrice(grandTotal)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Per person: {formatPrice(grandTotal / (trip.travelers_adults + trip.travelers_children))}
                    </p>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl h-12 text-base font-semibold shadow-lg shadow-secondary/20" size="lg">
                  Book This Trip
                </Button>

                <Button variant="outline" className="w-full mt-3 gap-2 rounded-xl h-11">
                  <MessageCircle className="w-4 h-4" />
                  Chat with Agent
                </Button>
              </motion.div>

              {/* Upsells */}
              {upsells.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card rounded-2xl border shadow-sm p-6"
                >
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-secondary" />
                    </div>
                    <h3 className="font-bold">Recommended for You</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {upsells.map((upsell) => {
                      const isIncluded = includedUpsells.has(upsell.id);
                      return (
                        <button
                          key={upsell.id}
                          onClick={() => toggleUpsell(upsell.id)}
                          className={cn(
                            'w-full p-4 rounded-xl border-2 text-left transition-all',
                            isIncluded
                              ? 'border-secondary bg-secondary/5 shadow-sm'
                              : 'border-border hover:border-secondary/40 hover:bg-muted/30'
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm">{upsell.title}</h4>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {upsell.description}
                              </p>
                              <p className="text-secondary font-bold text-sm mt-2">
                                +{formatPrice(upsell.price_aed)}
                              </p>
                            </div>
                            <div
                              className={cn(
                                'w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all',
                                isIncluded
                                  ? 'bg-secondary text-secondary-foreground scale-110'
                                  : 'border-2 border-muted-foreground/30'
                              )}
                            >
                              {isIncluded ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Plus className="w-4 h-4 text-muted-foreground" />
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
        </div>
      </div>
    </Layout>
  );
};

export default TripItinerary;
