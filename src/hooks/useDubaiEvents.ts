import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface DubaiEvent {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  event_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  venue: string | null;
  image_url: string | null;
  gallery: string[];
  category: string;
  tags: string[];
  ticket_url: string | null;
  price_from: number;
  is_free: boolean;
  is_featured: boolean;
  is_active: boolean;
  linked_tour_ids: string[];
  linked_service_ids: string[];
  linked_combo_ids: string[];
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export function useDubaiEvents(options?: { includeInactive?: boolean; category?: string; month?: number; year?: number }) {
  return useQuery({
    queryKey: ["dubai-events", options],
    queryFn: async () => {
      let query = supabase
        .from("dubai_events" as any)
        .select("*")
        .order("event_date", { ascending: true });

      if (!options?.includeInactive) {
        query = query.eq("is_active", true);
      }
      if (options?.category) {
        query = query.eq("category", options.category);
      }
      if (options?.month && options?.year) {
        const startDate = new Date(options.year, options.month - 1, 1).toISOString().split("T")[0];
        const endDate = new Date(options.year, options.month, 0).toISOString().split("T")[0];
        query = query.gte("event_date", startDate).lte("event_date", endDate);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as DubaiEvent[];
    },
  });
}

export function useDubaiEvent(slug: string) {
  return useQuery({
    queryKey: ["dubai-event", slug],
    queryFn: async () => {
      const { data, error } = await (supabase
        .from("dubai_events" as any)
        .select("*")
        .eq("slug", slug)
        .single() as any);
      if (error) throw error;
      return data as unknown as DubaiEvent;
    },
    enabled: !!slug,
  });
}

export function useCreateDubaiEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (event: Partial<DubaiEvent>) => {
      const { data, error } = await (supabase.from("dubai_events" as any).insert(event as any).select().single() as any);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dubai-events"] });
      toast({ title: "Event created successfully" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });
}

export function useUpdateDubaiEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DubaiEvent> & { id: string }) => {
      const { data, error } = await (supabase.from("dubai_events" as any).update(updates as any).eq("id", id).select().single() as any);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dubai-events"] });
      toast({ title: "Event updated successfully" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });
}

export function useDeleteDubaiEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from("dubai_events" as any).delete().eq("id", id) as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["dubai-events"] });
      toast({ title: "Event deleted" });
    },
    onError: (err: any) => toast({ title: "Error", description: err.message, variant: "destructive" }),
  });
}
