import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CarCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CarCategoryFormData {
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export const useCarCategories = () => {
  return useQuery({
    queryKey: ["car-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data as CarCategory[];
    },
  });
};

export const useAdminCarCategories = () => {
  return useQuery({
    queryKey: ["admin-car-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("car_categories")
        .select("*")
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data as CarCategory[];
    },
  });
};

export const useCreateCarCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CarCategoryFormData) => {
      const { data: result, error } = await supabase
        .from("car_categories")
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-car-categories"] });
      queryClient.invalidateQueries({ queryKey: ["car-categories"] });
      toast.success("Category created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateCarCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CarCategoryFormData> }) => {
      const { data: result, error } = await supabase
        .from("car_categories")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-car-categories"] });
      queryClient.invalidateQueries({ queryKey: ["car-categories"] });
      toast.success("Category updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteCarCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("car_categories")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-car-categories"] });
      queryClient.invalidateQueries({ queryKey: ["car-categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
