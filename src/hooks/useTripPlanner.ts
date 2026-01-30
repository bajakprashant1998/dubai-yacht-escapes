import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TripInput {
  arrivalDate: string;
  departureDate: string;
  adults: number;
  children: number;
  nationality: string;
  budgetTier: 'low' | 'medium' | 'luxury';
  travelStyle: 'family' | 'couple' | 'adventure' | 'relax' | 'luxury';
  specialOccasion?: string;
  hotelPreference?: number;
}

export interface TripItem {
  id: string;
  dayNumber: number;
  itemType: string;
  itemId: string | null;
  title: string;
  description: string | null;
  startTime: string | null;
  endTime: string | null;
  priceAed: number;
  quantity: number;
  isOptional: boolean;
  isIncluded: boolean;
  sortOrder: number;
  metadata: Record<string, unknown>;
}

export interface TripPlan {
  id: string;
  visitorId: string;
  status: string;
  destination: string;
  arrivalDate: string;
  departureDate: string;
  totalDays: number;
  travelersAdults: number;
  travelersChildren: number;
  nationality: string;
  budgetTier: string;
  travelStyle: string;
  specialOccasion: string | null;
  totalPriceAed: number;
  displayCurrency: string;
  displayPrice: number;
  items: TripItem[];
}

export interface GeneratedPlan {
  hotel: {
    id: string;
    name: string;
    nights: number;
    pricePerNight: number;
  };
  transport: {
    type: string;
    dailyRate: number;
    totalDays: number;
  };
  days: Array<{
    dayNumber: number;
    date: string;
    items: Array<{
      type: string;
      itemId: string | null;
      title: string;
      description: string;
      startTime: string;
      endTime: string;
      price: number;
    }>;
  }>;
  visa: {
    required: boolean;
    type: string | null;
    price: number;
    documents: string[];
  };
  upsells: Array<{
    itemId: string;
    title: string;
    description: string;
    price: number;
    reason: string;
  }>;
  summary: {
    hotelTotal: number;
    transportTotal: number;
    activitiesTotal: number;
    visaTotal: number;
    grandTotal: number;
  };
}

// Generate or retrieve visitor ID
const getVisitorId = (): string => {
  const stored = localStorage.getItem('trip_visitor_id');
  if (stored) return stored;
  
  const newId = `visitor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  localStorage.setItem('trip_visitor_id', newId);
  return newId;
};

export const useTripPlanner = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [tripId, setTripId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateTrip = useCallback(async (input: TripInput) => {
    setIsGenerating(true);
    setError(null);

    try {
      const visitorId = getVisitorId();
      
      const { data, error: fnError } = await supabase.functions.invoke('ai-trip-planner', {
        body: {
          action: 'generate',
          visitorId,
          input,
        },
      });

      if (fnError) throw fnError;

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate trip');
      }

      setGeneratedPlan(data.plan);
      setTripId(data.tripId);

      toast({
        title: 'Trip Generated!',
        description: 'Your personalized Dubai itinerary is ready.',
      });

      return { tripId: data.tripId, plan: data.plan };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate trip';
      setError(message);
      toast({
        title: 'Generation Failed',
        description: message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const modifyTrip = useCallback(async (tripId: string, modification: string, currentInput: TripInput) => {
    setIsGenerating(true);
    setError(null);

    try {
      const visitorId = getVisitorId();
      
      const { data, error: fnError } = await supabase.functions.invoke('ai-trip-planner', {
        body: {
          action: 'modify',
          tripId,
          visitorId,
          input: {
            ...currentInput,
            modifications: modification,
          },
        },
      });

      if (fnError) throw fnError;

      if (!data.success) {
        throw new Error(data.error || 'Failed to modify trip');
      }

      setGeneratedPlan(data.plan);
      setTripId(data.tripId);

      toast({
        title: 'Trip Updated!',
        description: 'Your itinerary has been modified.',
      });

      return { tripId: data.tripId, plan: data.plan };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to modify trip';
      setError(message);
      toast({
        title: 'Modification Failed',
        description: message,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const loadTrip = useCallback(async (id: string) => {
    try {
      const { data: trip, error: tripError } = await supabase
        .from('trip_plans')
        .select('*')
        .eq('id', id)
        .single();

      if (tripError) throw tripError;

      const { data: items, error: itemsError } = await supabase
        .from('trip_items')
        .select('*')
        .eq('trip_id', id)
        .order('day_number')
        .order('sort_order');

      if (itemsError) throw itemsError;

      return { trip, items };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load trip';
      setError(message);
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setGeneratedPlan(null);
    setTripId(null);
    setError(null);
  }, []);

  return {
    isGenerating,
    generatedPlan,
    tripId,
    error,
    generateTrip,
    modifyTrip,
    loadTrip,
    reset,
  };
};
