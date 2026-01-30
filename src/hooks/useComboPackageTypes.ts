import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ComboPackageType {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useComboPackageTypes = () => {
  return useQuery({
    queryKey: ["combo-package-types"],
    queryFn: async (): Promise<ComboPackageType[]> => {
      const { data, error } = await supabase
        .from("combo_package_types")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateComboPackageType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newType: { name: string; slug: string; icon?: string; color?: string; sort_order?: number; is_active?: boolean }) => {
      const { data, error } = await supabase
        .from("combo_package_types")
        .insert([newType])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["combo-package-types"] });
    },
  });
};

export const useUpdateComboPackageType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ComboPackageType> & { id: string }) => {
      const { data, error } = await supabase
        .from("combo_package_types")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["combo-package-types"] });
    },
  });
};

export const useDeleteComboPackageType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("combo_package_types")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["combo-package-types"] });
    },
  });
};
