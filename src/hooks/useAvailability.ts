import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface AvailabilitySlot {
  id: string;
  date: string;
  slots_total: number;
  slots_booked: number;
  is_available: boolean;
  special_price: number | null;
}

export function useTourAvailability(tourId: string | undefined) {
  return useQuery({
    queryKey: ["availability", "tour", tourId],
    queryFn: async (): Promise<AvailabilitySlot[]> => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("tour_availability")
        .select("*")
        .eq("tour_id", tourId!)
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(90);
      if (error) throw error;
      return data || [];
    },
    enabled: !!tourId,
  });
}

export function useServiceAvailability(serviceId: string | undefined) {
  return useQuery({
    queryKey: ["availability", "service", serviceId],
    queryFn: async (): Promise<AvailabilitySlot[]> => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("tour_availability")
        .select("*")
        .eq("service_id", serviceId!)
        .gte("date", today)
        .order("date", { ascending: true })
        .limit(90);
      if (error) throw error;
      return data || [];
    },
    enabled: !!serviceId,
  });
}

export function getAvailabilityStatus(slot: AvailabilitySlot | undefined) {
  if (!slot) return { status: "available" as const, label: "Available", slotsLeft: null };
  if (!slot.is_available) return { status: "soldout" as const, label: "Sold Out", slotsLeft: 0 };
  const slotsLeft = slot.slots_total - slot.slots_booked;
  if (slotsLeft <= 3) return { status: "limited" as const, label: `Only ${slotsLeft} left`, slotsLeft };
  return { status: "available" as const, label: "Available", slotsLeft };
}
