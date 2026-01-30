import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface VisaService {
  id: string;
  slug: string;
  title: string;
  visa_type: string;
  duration_days: number | null;
  validity: string | null;
  processing_time: string;
  price: number;
  original_price: number | null;
  description: string | null;
  long_description: string | null;
  requirements: string[];
  included: string[];
  excluded: string[];
  faqs: { question: string; answer: string }[];
  image_url: string | null;
  is_express: boolean;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface VisaServiceFormData {
  slug: string;
  title: string;
  visa_type: string;
  duration_days: number | null;
  validity: string | null;
  processing_time: string;
  price: number;
  original_price: number | null;
  description: string | null;
  long_description: string | null;
  requirements: string[];
  included: string[];
  excluded: string[];
  faqs: { question: string; answer: string }[];
  image_url: string | null;
  is_express: boolean;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
}

export const useVisaServices = () => {
  return useQuery({
    queryKey: ["visa-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visa_services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data as VisaService[];
    },
  });
};

export const useVisaService = (slug: string) => {
  return useQuery({
    queryKey: ["visa-service", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visa_services")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data as VisaService;
    },
    enabled: !!slug,
  });
};

export const useAdminVisaServices = () => {
  return useQuery({
    queryKey: ["admin-visa-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("visa_services")
        .select("*")
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data as VisaService[];
    },
  });
};

export const useCreateVisaService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: VisaServiceFormData) => {
      const { data: result, error } = await supabase
        .from("visa_services")
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-visa-services"] });
      queryClient.invalidateQueries({ queryKey: ["visa-services"] });
      toast.success("Visa service added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateVisaService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<VisaServiceFormData> }) => {
      const { data: result, error } = await supabase
        .from("visa_services")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-visa-services"] });
      queryClient.invalidateQueries({ queryKey: ["visa-services"] });
      queryClient.invalidateQueries({ queryKey: ["visa-service"] });
      toast.success("Visa service updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteVisaService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("visa_services")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-visa-services"] });
      queryClient.invalidateQueries({ queryKey: ["visa-services"] });
      toast.success("Visa service deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
