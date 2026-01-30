import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CarRental {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  category_id: string | null;
  seats: number;
  transmission: string;
  fuel_type: string;
  daily_price: number;
  weekly_price: number | null;
  monthly_price: number | null;
  deposit: number;
  driver_available: boolean;
  self_drive: boolean;
  features: string[];
  image_url: string | null;
  gallery: string[];
  description: string | null;
  long_description: string | null;
  requirements: string[];
  is_featured: boolean;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CarRentalFormData {
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  category_id: string | null;
  seats: number;
  transmission: string;
  fuel_type: string;
  daily_price: number;
  weekly_price: number | null;
  monthly_price: number | null;
  deposit: number;
  driver_available: boolean;
  self_drive: boolean;
  features: string[];
  image_url: string | null;
  gallery: string[];
  description: string | null;
  long_description: string | null;
  requirements: string[];
  is_featured: boolean;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
}

export const useCarRentals = (categorySlug?: string) => {
  return useQuery({
    queryKey: ["car-rentals", categorySlug],
    queryFn: async () => {
      let query = supabase
        .from("car_rentals")
        .select(`
          *,
          category:car_categories(id, name, slug)
        `)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (categorySlug) {
        const { data: category } = await supabase
          .from("car_categories")
          .select("id")
          .eq("slug", categorySlug)
          .single();
        
        if (category) {
          query = query.eq("category_id", category.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CarRental[];
    },
  });
};

export const useCarRental = (slug: string) => {
  return useQuery({
    queryKey: ["car-rental", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_rentals")
        .select(`
          *,
          category:car_categories(id, name, slug)
        `)
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data as CarRental;
    },
    enabled: !!slug,
  });
};

export const useAdminCarRentals = () => {
  return useQuery({
    queryKey: ["admin-car-rentals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_rentals")
        .select(`
          *,
          category:car_categories(id, name, slug)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as CarRental[];
    },
  });
};

export const useCreateCarRental = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CarRentalFormData) => {
      const { data: result, error } = await supabase
        .from("car_rentals")
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-car-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["car-rentals"] });
      toast.success("Car added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateCarRental = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CarRentalFormData> }) => {
      const { data: result, error } = await supabase
        .from("car_rentals")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-car-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["car-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["car-rental"] });
      toast.success("Car updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteCarRental = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("car_rentals")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-car-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["car-rentals"] });
      toast.success("Car deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
