import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface BlogTagFormData {
  name: string;
  slug: string;
}

export const useBlogTags = () => {
  return useQuery({
    queryKey: ["blog-tags"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_tags")
        .select("*")
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data as BlogTag[];
    },
  });
};

export const useCreateBlogTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: BlogTagFormData) => {
      const { data: result, error } = await supabase
        .from("blog_tags")
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-tags"] });
      toast.success("Tag created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateBlogTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BlogTagFormData> }) => {
      const { data: result, error } = await supabase
        .from("blog_tags")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-tags"] });
      toast.success("Tag updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteBlogTag = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_tags")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-tags"] });
      toast.success("Tag deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
