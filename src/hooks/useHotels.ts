import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Hotel {
  id: string;
  slug: string;
  name: string;
  star_rating: number;
  category: string;
  location: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  long_description: string | null;
  amenities: string[];
  highlights: string[];
  image_url: string | null;
  gallery: string[];
  price_from: number | null;
  contact_phone: string | null;
  contact_email: string | null;
  check_in_time: string;
  check_out_time: string;
  is_featured: boolean;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface HotelFormData {
  slug: string;
  name: string;
  star_rating: number;
  category: string;
  location: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  long_description: string | null;
  amenities: string[];
  highlights: string[];
  image_url: string | null;
  gallery: string[];
  price_from: number | null;
  contact_phone: string | null;
  contact_email: string | null;
  check_in_time: string;
  check_out_time: string;
  is_featured: boolean;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
}

export const useHotels = (category?: string) => {
  return useQuery({
    queryKey: ["hotels", category],
    queryFn: async () => {
      let query = supabase
        .from("hotels")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Hotel[];
    },
  });
};

export const useHotel = (slug: string) => {
  return useQuery({
    queryKey: ["hotel", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotels")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data as Hotel;
    },
    enabled: !!slug,
  });
};

export const useAdminHotels = () => {
  return useQuery({
    queryKey: ["admin-hotels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hotels")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Hotel[];
    },
  });
};

export const useCreateHotel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: HotelFormData) => {
      const { data: result, error } = await supabase
        .from("hotels")
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hotels"] });
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast.success("Hotel added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateHotel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<HotelFormData> }) => {
      const { data: result, error } = await supabase
        .from("hotels")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hotels"] });
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["hotel"] });
      toast.success("Hotel updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteHotel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("hotels")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-hotels"] });
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast.success("Hotel deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
