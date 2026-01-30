import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  author_id: string | null;
  category_id: string | null;
  tags: string[];
  reading_time: number;
  published_at: string | null;
  is_featured: boolean;
  is_published: boolean;
  view_count: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[];
  created_at: string;
  updated_at: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  author?: {
    id: string;
    full_name: string | null;
  };
}

export interface BlogPostFormData {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  featured_image: string | null;
  author_id: string | null;
  category_id: string | null;
  tags: string[];
  reading_time: number;
  published_at: string | null;
  is_featured: boolean;
  is_published: boolean;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[];
}

export const useBlogPosts = (categorySlug?: string) => {
  return useQuery({
    queryKey: ["blog-posts", categorySlug],
    queryFn: async () => {
      let query = supabase
        .from("blog_posts")
        .select(`
          *,
          category:blog_categories(id, name, slug),
          author:profiles(id, full_name)
        `)
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (categorySlug) {
        const { data: category } = await supabase
          .from("blog_categories")
          .select("id")
          .eq("slug", categorySlug)
          .single();
        
        if (category) {
          query = query.eq("category_id", category.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as BlogPost[];
    },
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          category:blog_categories(id, name, slug),
          author:profiles(id, full_name)
        `)
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      
      // Increment view count (fire and forget)
      supabase
        .from("blog_posts")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", data.id)
        .then(() => {});
      
      return data as BlogPost;
    },
    enabled: !!slug,
  });
};

export const useAdminBlogPosts = () => {
  return useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(`
          *,
          category:blog_categories(id, name, slug),
          author:profiles(id, full_name)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    },
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: BlogPostFormData) => {
      const { data: result, error } = await supabase
        .from("blog_posts")
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success("Blog post created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BlogPostFormData> }) => {
      const { data: result, error } = await supabase
        .from("blog_posts")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-post"] });
      toast.success("Blog post updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      toast.success("Blog post deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
