import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";
import { useBlogCategories } from "@/hooks/useBlogCategories";
import { useCreateBlogPost, useUpdateBlogPost, BlogPost } from "@/hooks/useBlogPosts";
import CharacterCounter from "./CharacterCounter";
import SEOPreview from "./SEOPreview";
import RichTextEditor from "./RichTextEditor";
import KeywordsInput from "./KeywordsInput";

interface BlogPostFormProps {
  post?: BlogPost;
  mode: "create" | "edit";
}

const BlogPostForm = ({ post, mode }: BlogPostFormProps) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const createPost = useCreateBlogPost();
  const updatePost = useUpdateBlogPost();
  const { data: categories = [], isLoading: categoriesLoading } = useBlogCategories();

  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    category_id: post?.category_id || "",
    tags: post?.tags || [],
    featured_image: post?.featured_image || "",
    reading_time: post?.reading_time?.toString() || "",
    is_featured: post?.is_featured || false,
    is_published: post?.is_published ?? false,
    meta_title: post?.meta_title || "",
    meta_description: post?.meta_description || "",
    meta_keywords: post?.meta_keywords || [],
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: mode === "create" ? generateSlug(title) : prev.slug,
    }));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `posts/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      toast.error("Failed to upload image");
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from("blog-images")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    const url = await uploadImage(file);
    if (url) {
      setFormData((prev) => ({ ...prev, featured_image: url }));
      toast.success("Image uploaded successfully");
    }
    setIsUploadingImage(false);
  };

  // Calculate reading time from content
  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200;
    const wordCount = text.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt || null,
      content: formData.content || null,
      category_id: formData.category_id || null,
      author_id: null,
      tags: formData.tags?.length ? formData.tags : null,
      featured_image: formData.featured_image || null,
      reading_time: formData.reading_time ? parseInt(formData.reading_time) : calculateReadingTime(formData.content),
      is_featured: formData.is_featured,
      is_published: formData.is_published,
      published_at: formData.is_published ? new Date().toISOString() : null,
      meta_title: formData.meta_title || null,
      meta_description: formData.meta_description || null,
      meta_keywords: formData.meta_keywords?.length ? formData.meta_keywords : null,
    };

    if (mode === "create") {
      createPost.mutate(postData, {
        onSuccess: () => navigate("/admin/blog"),
      });
    } else if (post) {
      updatePost.mutate({ id: post.id, data: postData }, {
        onSuccess: () => navigate("/admin/blog"),
      });
    }
  };

  const isSubmitting = createPost.isPending || updatePost.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={handleTitleChange}
                    placeholder="Enter post title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    placeholder="post-url-slug"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  {categoriesLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, category_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reading_time">Reading Time (minutes)</Label>
                  <Input
                    id="reading_time"
                    type="number"
                    value={formData.reading_time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, reading_time: e.target.value }))}
                    placeholder="Auto-calculated if empty"
                  />
                </div>
              </div>

              <RichTextEditor
                id="excerpt"
                label="Excerpt"
                value={formData.excerpt}
                onChange={(value) => setFormData((prev) => ({ ...prev, excerpt: value }))}
                placeholder="Brief summary for listings..."
                rows={3}
                helpText="Shown on blog cards and search results"
              />

              <RichTextEditor
                id="content"
                label="Content"
                value={formData.content}
                onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
                placeholder="Write your blog post content..."
                rows={20}
                helpText="Full blog post content with formatting"
              />
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {formData.featured_image ? (
                <div className="relative w-full h-64">
                  <img
                    src={formData.featured_image}
                    alt="Featured"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData((prev) => ({ ...prev, featured_image: "" }))}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="w-full h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors"
                >
                  {isUploadingImage ? (
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload featured image</span>
                    </>
                  )}
                </button>
              )}
            </CardContent>
          </Card>

          {/* SEO */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <CharacterCounter current={formData.meta_title.length} max={60} />
                </div>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO page title"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <CharacterCounter current={formData.meta_description.length} max={160} />
                </div>
                <Input
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="SEO page description"
                />
              </div>

              <KeywordsInput
                keywords={formData.meta_keywords}
                onChange={(keywords) => setFormData((prev) => ({ ...prev, meta_keywords: keywords }))}
              />

              <SEOPreview
                title={formData.meta_title || formData.title}
                description={formData.meta_description || formData.excerpt}
                slug={formData.slug}
                baseUrl="rentalyachtindubai.com/blog"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="is_published">Published</Label>
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_published: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="is_featured">Featured</Label>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <KeywordsInput
                keywords={formData.tags}
                onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
              />
            </CardContent>
          </Card>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === "create" ? "Create Post" : "Update Post"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/blog")}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default BlogPostForm;
