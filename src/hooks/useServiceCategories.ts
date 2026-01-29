import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapServiceCategoryFromRow, ServiceCategory } from "@/lib/serviceMapper";
import { useToast } from "@/hooks/use-toast";

export function useServiceCategories() {
  return useQuery({
    queryKey: ["service-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data.map(mapServiceCategoryFromRow);
    },
  });
}

export function useActiveServiceCategories() {
  return useQuery({
    queryKey: ["service-categories", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_categories")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) throw error;
      return data.map(mapServiceCategoryFromRow);
    },
  });
}

export function useServiceCategoriesWithCount() {
  return useQuery({
    queryKey: ["service-categories", "with-count"],
    queryFn: async () => {
      const { data: categories, error: catError } = await supabase
        .from("service_categories")
        .select("*")
        .order("sort_order", { ascending: true });

      if (catError) throw catError;

      const { data: services, error: svcError } = await supabase
        .from("services")
        .select("category_id")
        .eq("is_active", true);

      if (svcError) throw svcError;

      const countMap = new Map<string, number>();
      services.forEach((s) => {
        if (s.category_id) {
          countMap.set(s.category_id, (countMap.get(s.category_id) || 0) + 1);
        }
      });

      return categories.map((cat) => ({
        ...mapServiceCategoryFromRow(cat),
        serviceCount: countMap.get(cat.id) || 0,
      }));
    },
  });
}

interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image_url?: string;
  is_active?: boolean;
  sort_order?: number;
}

export function useCreateServiceCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateCategoryInput) => {
      const { data, error } = await supabase
        .from("service_categories")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return mapServiceCategoryFromRow(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-categories"] });
      toast({ title: "Category created successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to create category",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: string;
}

export function useUpdateServiceCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateCategoryInput) => {
      const { data, error } = await supabase
        .from("service_categories")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return mapServiceCategoryFromRow(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-categories"] });
      toast({ title: "Category updated successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to update category",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useDeleteServiceCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("service_categories")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["service-categories"] });
      toast({ title: "Category deleted successfully" });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete category",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
