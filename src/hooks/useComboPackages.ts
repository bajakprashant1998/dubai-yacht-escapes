import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

export interface ComboPackageItem {
  id: string;
  combo_id: string;
  day_number: number;
  item_type: string;
  item_id: string | null;
  title: string;
  description: string | null;
  start_time: string | null;
  end_time: string | null;
  price_aed: number;
  is_mandatory: boolean;
  is_flexible: boolean;
  sort_order: number;
  metadata: Json;
  created_at: string;
}

export interface ComboPackageItemInput {
  combo_id: string;
  day_number: number;
  item_type: string;
  item_id?: string | null;
  title: string;
  description?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  price_aed: number;
  is_mandatory?: boolean;
  is_flexible?: boolean;
  sort_order?: number;
  metadata?: Json;
}

export interface ComboPackage {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  combo_type: string;
  duration_days: number;
  duration_nights: number;
  base_price_aed: number;
  discount_percent: number;
  final_price_aed: number;
  image_url: string | null;
  gallery: string[];
  includes_hotel: boolean;
  hotel_star_rating: number | null;
  includes_visa: boolean;
  includes_transport: boolean;
  transport_type: string | null;
  highlights: string[];
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  seasonal_pricing: Json;
  blackout_dates: Json;
  created_at: string;
  updated_at: string;
  items?: ComboPackageItem[];
}

export interface ComboPackageInput {
  name: string;
  slug: string;
  description?: string | null;
  long_description?: string | null;
  combo_type: string;
  duration_days: number;
  duration_nights: number;
  base_price_aed: number;
  discount_percent: number;
  final_price_aed: number;
  image_url?: string | null;
  gallery?: string[];
  includes_hotel?: boolean;
  hotel_star_rating?: number | null;
  includes_visa?: boolean;
  includes_transport?: boolean;
  transport_type?: string | null;
  highlights?: string[];
  is_featured?: boolean;
  is_active?: boolean;
  sort_order?: number;
  meta_title?: string | null;
  meta_description?: string | null;
  seasonal_pricing?: Json;
  blackout_dates?: Json;
}

// Fetch all combo packages
export const useComboPackages = (options?: { 
  type?: string; 
  featured?: boolean;
  activeOnly?: boolean;
}) => {
  return useQuery({
    queryKey: ["combo-packages", options],
    queryFn: async () => {
      let query = supabase
        .from("combo_packages")
        .select("*")
        .order("sort_order", { ascending: true });

      if (options?.type && options.type !== "all") {
        query = query.eq("combo_type", options.type);
      }

      if (options?.featured) {
        query = query.eq("is_featured", true);
      }

      if (options?.activeOnly !== false) {
        query = query.eq("is_active", true);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ComboPackage[];
    },
  });
};

// Fetch single combo package by slug
export const useComboPackage = (slug: string) => {
  return useQuery({
    queryKey: ["combo-package", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("combo_packages")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data as ComboPackage;
    },
    enabled: !!slug,
  });
};

// Fetch combo package with items
export const useComboPackageWithItems = (slug: string) => {
  return useQuery({
    queryKey: ["combo-package-with-items", slug],
    queryFn: async () => {
      // Fetch combo package
      const { data: combo, error: comboError } = await supabase
        .from("combo_packages")
        .select("*")
        .eq("slug", slug)
        .single();

      if (comboError) throw comboError;

      // Fetch items
      const { data: items, error: itemsError } = await supabase
        .from("combo_package_items")
        .select("*")
        .eq("combo_id", combo.id)
        .order("day_number", { ascending: true })
        .order("sort_order", { ascending: true });

      if (itemsError) throw itemsError;

      return {
        ...combo,
        items: items || [],
      } as ComboPackage;
    },
    enabled: !!slug,
  });
};

// Create combo package
export const useCreateComboPackage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: ComboPackageInput) => {
      const { data, error } = await supabase
        .from("combo_packages")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as ComboPackage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["combo-packages"] });
      toast({
        title: "Combo Package Created",
        description: "The combo package has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Update combo package
export const useUpdateComboPackage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...input }: ComboPackageInput & { id: string }) => {
      const { data, error } = await supabase
        .from("combo_packages")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as ComboPackage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["combo-packages"] });
      queryClient.invalidateQueries({ queryKey: ["combo-package", data.slug] });
      toast({
        title: "Combo Package Updated",
        description: "The combo package has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Delete combo package
export const useDeleteComboPackage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("combo_packages")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["combo-packages"] });
      toast({
        title: "Combo Package Deleted",
        description: "The combo package has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Toggle combo package active status
export const useToggleComboPackageStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data, error } = await supabase
        .from("combo_packages")
        .update({ is_active })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as ComboPackage;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["combo-packages"] });
      toast({
        title: data.is_active ? "Combo Activated" : "Combo Deactivated",
        description: `${data.name} is now ${data.is_active ? "active" : "inactive"}.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Manage combo package items
export const useComboPackageItems = (comboId: string) => {
  return useQuery({
    queryKey: ["combo-package-items", comboId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("combo_package_items")
        .select("*")
        .eq("combo_id", comboId)
        .order("day_number", { ascending: true })
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data as ComboPackageItem[];
    },
    enabled: !!comboId,
  });
};

export const useCreateComboPackageItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Omit<ComboPackageItem, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("combo_package_items")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as ComboPackageItem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["combo-package-items", data.combo_id] });
    },
  });
};

export const useUpdateComboPackageItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, combo_id, ...input }: Partial<ComboPackageItem> & { id: string; combo_id: string }) => {
      const { data, error } = await supabase
        .from("combo_package_items")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return { ...data, combo_id } as ComboPackageItem;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["combo-package-items", data.combo_id] });
    },
  });
};

export const useDeleteComboPackageItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, combo_id }: { id: string; combo_id: string }) => {
      const { error } = await supabase
        .from("combo_package_items")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { combo_id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["combo-package-items", data.combo_id] });
    },
  });
};

// Helper function to calculate combo pricing
export const calculateComboPrice = (
  basePrice: number,
  discountPercent: number
): { originalPrice: number; finalPrice: number; savings: string } => {
  const discountAmount = basePrice * (discountPercent / 100);
  const finalPrice = basePrice - discountAmount;
  return {
    originalPrice: basePrice,
    finalPrice: Math.round(finalPrice),
    savings: `Save ${discountPercent}%`,
  };
};

// Helper function to generate slug
export const generateComboSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};
