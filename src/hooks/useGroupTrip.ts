import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GroupTrip {
  id: string;
  name: string;
  share_code: string;
  creator_name: string;
  creator_email: string;
  creator_phone: string | null;
  trip_date: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface GroupTripMember {
  id: string;
  group_trip_id: string;
  name: string;
  email: string;
  phone: string | null;
  payment_status: string;
  amount_owed: number;
  amount_paid: number;
  is_organizer: boolean;
  joined_at: string;
  notes: string | null;
}

export interface GroupTripItem {
  id: string;
  group_trip_id: string;
  item_type: string;
  item_id: string | null;
  title: string;
  slug: string | null;
  image_url: string | null;
  price_per_person: number;
  quantity: number;
  added_by: string | null;
  created_at: string;
}

export const useGroupTrip = (shareCode: string | undefined) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const tripQuery = useQuery({
    queryKey: ["group-trip", shareCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_trips")
        .select("*")
        .eq("share_code", shareCode!)
        .single();
      if (error) throw error;
      return data as GroupTrip;
    },
    enabled: !!shareCode,
  });

  const membersQuery = useQuery({
    queryKey: ["group-trip-members", tripQuery.data?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_trip_members")
        .select("*")
        .eq("group_trip_id", tripQuery.data!.id)
        .order("joined_at");
      if (error) throw error;
      return data as GroupTripMember[];
    },
    enabled: !!tripQuery.data?.id,
  });

  const itemsQuery = useQuery({
    queryKey: ["group-trip-items", tripQuery.data?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("group_trip_items")
        .select("*")
        .eq("group_trip_id", tripQuery.data!.id)
        .order("created_at");
      if (error) throw error;
      return data as GroupTripItem[];
    },
    enabled: !!tripQuery.data?.id,
  });

  const addMember = useMutation({
    mutationFn: async (member: { name: string; email: string; phone?: string }) => {
      const { error } = await supabase.from("group_trip_members").insert({
        group_trip_id: tripQuery.data!.id,
        ...member,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-trip-members", tripQuery.data?.id] });
      toast({ title: "Member added!" });
    },
  });

  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase.from("group_trip_members").delete().eq("id", memberId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-trip-members", tripQuery.data?.id] });
    },
  });

  const addItem = useMutation({
    mutationFn: async (item: { item_type: string; item_id?: string; title: string; slug?: string; image_url?: string; price_per_person: number; quantity?: number; added_by?: string }) => {
      const { error } = await supabase.from("group_trip_items").insert({
        group_trip_id: tripQuery.data!.id,
        ...item,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-trip-items", tripQuery.data?.id] });
      toast({ title: "Activity added to group!" });
    },
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase.from("group_trip_items").delete().eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-trip-items", tripQuery.data?.id] });
    },
  });

  // Calculate split costs
  const members = membersQuery.data || [];
  const items = itemsQuery.data || [];
  const totalCost = items.reduce((sum, item) => sum + item.price_per_person * item.quantity, 0);
  const perPersonCost = members.length > 0 ? totalCost / members.length : totalCost;

  return {
    trip: tripQuery.data,
    members,
    items,
    totalCost,
    perPersonCost,
    isLoading: tripQuery.isLoading,
    addMember: addMember.mutate,
    removeMember: removeMember.mutate,
    addItem: addItem.mutate,
    removeItem: removeItem.mutate,
  };
};

export const useCreateGroupTrip = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { name: string; creator_name: string; creator_email: string; creator_phone?: string; trip_date?: string }) => {
      const { data: trip, error } = await supabase
        .from("group_trips")
        .insert(data)
        .select()
        .single();
      if (error) throw error;

      // Add creator as organizer member
      await supabase.from("group_trip_members").insert({
        group_trip_id: trip.id,
        name: data.creator_name,
        email: data.creator_email,
        phone: data.creator_phone,
        is_organizer: true,
      });

      return trip as GroupTrip;
    },
    onSuccess: () => {
      toast({ title: "Group trip created!", description: "Share the link with your group." });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
};
