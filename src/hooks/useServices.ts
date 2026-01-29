import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapServiceFromRow, Service } from "@/lib/serviceMapper";
import { useToast } from "@/hooks/use-toast";

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`*, service_categories(*)`)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data.map((row) => mapServiceFromRow(row, row.service_categories));
    },
  });
}

export function useAllServices() {
  return useQuery({
    queryKey: ["services", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`*, service_categories(*)`)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data.map((row) => mapServiceFromRow(row, row.service_categories));
    },
  });
}

export function useFeaturedServices() {
  return useQuery({
    queryKey: ["services", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`*, service_categories(*)`)
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("sort_order", { ascending: true })
        .limit(8);

      if (error) throw error;
      return data.map((row) => mapServiceFromRow(row, row.service_categories));
    },
  });
}

export function useService(slug: string) {
  return useQuery({
    queryKey: ["services", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select(`*, service_categories(*)`)
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return mapServiceFromRow(data, data.service_categories);
    },
    enabled: !!slug,
  });
}

export function useServicesByCategory(categorySlug: string) {
  return useQuery({
    queryKey: ["services", "category", categorySlug],
    queryFn: async () => {
      const { data: category, error: catError } = await supabase
        .from("service_categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();

      if (catError) throw catError;

      const { data, error } = await supabase
        .from("services")
        .select(`*, service_categories(*)`)
        .eq("is_active", true)
        .eq("category_id", category.id)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data.map((row) => mapServiceFromRow(row, row.service_categories));
    },
    enabled: !!categorySlug,
  });
}

interface CreateServiceInput {
  slug: string;
  title: string;
  subtitle?: string;
  description?: string;
  long_description?: string;
  price: number;
  original_price?: number;
  duration?: string;
  image_url?: string;
  gallery?: string[];
  category_id?: string;
  highlights?: string[];
  included?: string[];
  excluded?: string[];
  meeting_point?: string;
  is_featured?: boolean;
  is_active?: boolean;
  booking_type?: string;
  min_participants?: number;
  max_participants?: number;
  cancellation_policy?: string;
  instant_confirmation?: boolean;
  hotel_pickup?: boolean;
  sort_order?: number;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string[];
}

export function useCreateService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateServiceInput) => {
      const { data, error } = await supabase
        .from("services")
        .insert(input)
        .select(`*, service_categories(*)`)
        .single();

      if (error) throw error;
      return mapServiceFromRow(data, data.service_categories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({ title: "Service created successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to create service",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

interface UpdateServiceInput extends Partial<CreateServiceInput> {
  id: string;
}

export function useUpdateService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateServiceInput) => {
      const { data, error } = await supabase
        .from("services")
        .update(input)
        .eq("id", id)
        .select(`*, service_categories(*)`)
        .single();

      if (error) throw error;
      return mapServiceFromRow(data, data.service_categories);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({ title: "Service updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to update service",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({ title: "Service deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete service",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useToggleServiceStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("services")
        .update({ is_active: isActive })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({
        title: isActive ? "Service activated" : "Service deactivated",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update service status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useToggleServiceFeatured() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      id,
      isFeatured,
    }: {
      id: string;
      isFeatured: boolean;
    }) => {
      const { error } = await supabase
        .from("services")
        .update({ is_featured: isFeatured })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { isFeatured }) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      toast({
        title: isFeatured ? "Service featured" : "Service unfeatured",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update featured status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
