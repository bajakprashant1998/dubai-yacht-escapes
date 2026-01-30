import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
  source: string;
  created_at: string;
  updated_at: string;
}

export const useNewsletterSubscribers = () => {
  return useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });

      if (error) throw error;
      return data as NewsletterSubscriber[];
    },
  });
};

export const useSubscribeNewsletter = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email, source: "website" });

      if (error) {
        // Handle unique constraint violation
        if (error.code === "23505") {
          throw new Error("You're already subscribed!");
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Welcome aboard! 🎉",
        description: "You've successfully subscribed to our newsletter.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useToggleSubscriberStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
      toast({
        title: "Status updated",
        description: "Subscriber status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update subscriber status.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteSubscriber = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
      toast({
        title: "Subscriber removed",
        description: "The subscriber has been removed from the list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove subscriber.",
        variant: "destructive",
      });
    },
  });
};
