import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FAQInput {
  question: string;
  answer: string;
  category?: string;
  sort_order?: number;
  is_active?: boolean;
}

// Fetch all FAQs (admin view - includes inactive)
export const useAdminFAQs = () => {
  return useQuery({
    queryKey: ["admin-faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .order("category")
        .order("sort_order");

      if (error) throw error;
      return data as FAQ[];
    },
  });
};

// Fetch active FAQs only (public view)
export const useFAQs = () => {
  return useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("*")
        .eq("is_active", true)
        .order("category")
        .order("sort_order");

      if (error) throw error;
      return data as FAQ[];
    },
  });
};

// Create FAQ
export const useCreateFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: FAQInput) => {
      const { data, error } = await supabase
        .from("faqs")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create FAQ: " + error.message);
    },
  });
};

// Update FAQ
export const useUpdateFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: FAQInput & { id: string }) => {
      const { data, error } = await supabase
        .from("faqs")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update FAQ: " + error.message);
    },
  });
};

// Delete FAQ
export const useDeleteFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("faqs").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success("FAQ deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete FAQ: " + error.message);
    },
  });
};

// Toggle FAQ active status
export const useToggleFAQ = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from("faqs")
        .update({ is_active })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      toast.success(`FAQ ${data.is_active ? "activated" : "deactivated"}`);
    },
    onError: (error) => {
      toast.error("Failed to update FAQ: " + error.message);
    },
  });
};
