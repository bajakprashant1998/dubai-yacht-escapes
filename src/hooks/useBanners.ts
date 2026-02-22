import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link_url: string | null;
  link_text: string | null;
  bg_color: string;
  text_color: string;
  position: string;
  starts_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const useBanners = (position?: string) => {
  return useQuery({
    queryKey: ["banners", position],
    queryFn: async () => {
      let query = supabase
        .from("promotional_banners")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");

      if (position) {
        query = query.eq("position", position);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Banner[];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useAdminBanners = () => {
  return useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotional_banners")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Banner[];
    },
  });
};

export const useBannerMutations = () => {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async (banner: Partial<Banner>) => {
      const { data, error } = await supabase
        .from("promotional_banners")
        .insert(banner as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-banners"] }),
  });

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Banner> & { id: string }) => {
      const { error } = await supabase
        .from("promotional_banners")
        .update(updates as any)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-banners"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("promotional_banners")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-banners"] }),
  });

  return { create, update, remove };
};
