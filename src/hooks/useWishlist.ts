import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export function useCurrentUser() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return userId;
}

export function useWishlist() {
  const userId = useCurrentUser();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: wishlistItems = [], ...query } = useQuery({
    queryKey: ["wishlist", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("wishlists")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!userId,
  });

  const isInWishlist = (tourId?: string, serviceId?: string) => {
    return wishlistItems.some(
      (item: any) =>
        (tourId && item.tour_id === tourId) ||
        (serviceId && item.service_id === serviceId)
    );
  };

  const toggleWishlist = useMutation({
    mutationFn: async ({ tourId, serviceId }: { tourId?: string; serviceId?: string }) => {
      if (!userId) throw new Error("Please sign in to save items");

      const existing = wishlistItems.find(
        (item: any) =>
          (tourId && item.tour_id === tourId) ||
          (serviceId && item.service_id === serviceId)
      );

      if (existing) {
        const { error } = await supabase.from("wishlists").delete().eq("id", existing.id);
        if (error) throw error;
        return { action: "removed" };
      } else {
        const { error } = await supabase.from("wishlists").insert({
          user_id: userId,
          tour_id: tourId || null,
          service_id: serviceId || null,
        });
        if (error) throw error;
        return { action: "added" };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({
        title: result.action === "added" ? "Added to wishlist" : "Removed from wishlist",
        description: result.action === "added"
          ? "You'll be able to track this item."
          : "Item removed from your wishlist.",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const togglePriceAlert = useMutation({
    mutationFn: async ({ itemId, enabled, alertPrice }: { itemId: string; enabled: boolean; alertPrice?: number }) => {
      const { error } = await supabase
        .from("wishlists")
        .update({ price_alert: enabled, alert_price: alertPrice || null })
        .eq("id", itemId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast({ title: "Price alert updated" });
    },
  });

  return {
    wishlistItems,
    isInWishlist,
    toggleWishlist,
    togglePriceAlert,
    userId,
    ...query,
  };
}
