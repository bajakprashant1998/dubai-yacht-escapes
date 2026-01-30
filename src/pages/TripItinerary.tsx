import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
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
  Minus,
  Share2,
  Download,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Check,
  Loader2,
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
        
        // Expand first day by default
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

  // Group items by day
  const itemsByDay = items.reduce<Record<number, TripItem[]>>((acc, item) => {
    const day = item.day_number;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  // Get hotel, transport, visa, upsells
  const hotelItem = items.find(i => i.item_type === 'hotel');
  const transportItem = items.find(i => i.item_type === 'car');
  const visaItem = items.find(i => i.item_type === 'visa');
  const upsells = items.filter(i => i.item_type === 'upsell');

  // Calculate total with optional upsells
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
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'transfer':
        return <Car className="w-4 h-4" />;
      case 'activity':
      case 'tour':
        return <Star className="w-4 h-4" />;
      case 'meal':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-10">
          <Skeleton className="h-12 w-64 mb-6" />
          <Skeleton className="h-48 w-full mb-4" />
          <Skeleton className="h-48 w-full mb-4" />
          <Skeleton className="h-48 w-full" />
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
        {/* Header */}
        <div className="bg-primary text-primary-foreground py-8">
          <div className="container">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {trip.budget_tier.charAt(0).toUpperCase() + trip.budget_tier.slice(1)} • {trip.travel_style.charAt(0).toUpperCase() + trip.travel_style.slice(1)}
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Your {trip.total_days}-Day Dubai Adventure
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-primary-foreground/80 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(trip.arrival_date), 'MMM d')} - {format(new Date(trip.departure_date), 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {trip.travelers_adults + trip.travelers_children} Travelers
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CurrencySelector compact />
                <Button variant="secondary" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => window.print()}
                >
                  <Download className="w-4 h-4" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Itinerary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Essentials Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hotel */}
                {hotelItem && (
                  <div className="bg-card rounded-xl p-5 border">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Hotel className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Accommodation</p>
                        <h3 className="font-semibold">{hotelItem.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {hotelItem.quantity} nights
                        </p>
                        <p className="text-secondary font-medium mt-2">
                          {formatPrice(hotelItem.price_aed)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Transport */}
                {transportItem && (
                  <div className="bg-card rounded-xl p-5 border">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Car className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">Transport</p>
                        <h3 className="font-semibold">{transportItem.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {transportItem.quantity} days
                        </p>
                        <p className="text-secondary font-medium mt-2">
                          {formatPrice(transportItem.price_aed)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Visa Notice */}
              {visaItem && (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center gap-4">
                  <Plane className="w-6 h-6 text-amber-600" />
                  <div className="flex-1">
                    <h3 className="font-medium text-amber-800 dark:text-amber-200">
                      {visaItem.title}
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Included in your trip • {formatPrice(visaItem.price_aed)}
                    </p>
                  </div>
                  <Check className="w-5 h-5 text-amber-600" />
                </div>
              )}

              {/* Day-by-Day Itinerary */}
              <div>
                <h2 className="text-xl font-bold mb-4">Your Day-by-Day Itinerary</h2>
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
                        <div className="bg-card rounded-xl border overflow-hidden">
                          <CollapsibleTrigger
                            onClick={() => toggleDay(day)}
                            className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-secondary text-secondary-foreground flex flex-col items-center justify-center">
                                <span className="text-xs font-medium">Day</span>
                                <span className="text-lg font-bold">{day}</span>
                              </div>
                              <div className="text-left">
                                <h3 className="font-semibold">
                                  {day === 1
                                    ? 'Arrival Day'
                                    : day === trip.total_days
                                    ? 'Departure Day'
                                    : format(dayDate, 'EEEE')}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {format(dayDate, 'MMM d, yyyy')} • {dayItems.length} activities
                                </p>
                              </div>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="px-4 pb-4 pt-2 space-y-3 border-t">
                              {dayItems.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">
                                  {day === trip.total_days
                                    ? 'Free time for packing & airport transfer'
                                    : 'Free day to explore on your own'}
                                </p>
                              ) : (
                                dayItems.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-start gap-4 p-3 rounded-lg bg-muted/50"
                                  >
                                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center shrink-0">
                                      {getItemIcon(item.item_type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-2">
                                        <div>
                                          <h4 className="font-medium">{item.title}</h4>
                                          {item.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                              {item.description}
                                            </p>
                                          )}
                                        </div>
                                        {item.price_aed > 0 && (
                                          <span className="text-sm font-medium text-secondary shrink-0">
                                            {formatPrice(item.price_aed)}
                                          </span>
                                        )}
                                      </div>
                                      {item.start_time && (
                                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                          <Clock className="w-3 h-3" />
                                          {item.start_time}
                                          {item.end_time && ` - ${item.end_time}`}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar - Pricing & Upsells */}
            <div className="space-y-6">
              {/* Price Summary */}
              <div className="bg-card rounded-xl border p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">Trip Summary</h3>
                
                <div className="space-y-3 text-sm">
                  {hotelItem && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hotel ({hotelItem.quantity} nights)</span>
                      <span>{formatPrice(hotelItem.price_aed)}</span>
                    </div>
                  )}
                  {transportItem && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Transport</span>
                      <span>{formatPrice(transportItem.price_aed)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Activities & Tours</span>
                    <span>
                      {formatPrice(
                        items
                          .filter(i => ['activity', 'tour', 'transfer'].includes(i.item_type))
                          .reduce((sum, i) => sum + i.price_aed, 0)
                      )}
                    </span>
                  </div>
                  {visaItem && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Visa</span>
                      <span>{formatPrice(visaItem.price_aed)}</span>
                    </div>
                  )}
                  
                  {includedUpsells.size > 0 && (
                    <div className="flex justify-between text-secondary">
                      <span>Add-ons</span>
                      <span>+{formatPrice(upsellTotal)}</span>
                    </div>
                  )}

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-secondary">{formatPrice(grandTotal)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Per person: {formatPrice(grandTotal / (trip.travelers_adults + trip.travelers_children))}
                    </p>
                  </div>
                </div>

                <Button className="w-full mt-6 bg-secondary hover:bg-secondary/90 text-secondary-foreground" size="lg">
                  Book This Trip
                </Button>

                <Button variant="outline" className="w-full mt-3 gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat with Agent
                </Button>
              </div>

              {/* Upsells */}
              {upsells.length > 0 && (
                <div className="bg-card rounded-xl border p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-secondary" />
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
                            'w-full p-4 rounded-lg border text-left transition-all',
                            isIncluded
                              ? 'border-secondary bg-secondary/5'
                              : 'border-border hover:border-secondary/50'
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <h4 className="font-medium">{upsell.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {upsell.description}
                              </p>
                              <p className="text-secondary font-medium mt-2">
                                +{formatPrice(upsell.price_aed)}
                              </p>
                            </div>
                            <div
                              className={cn(
                                'w-6 h-6 rounded-full flex items-center justify-center shrink-0',
                                isIncluded
                                  ? 'bg-secondary text-secondary-foreground'
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TripItinerary;
