import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Upload, X, Loader2, Save, Eye, FileText, Image, Search, Settings,
  CheckCircle2, AlertCircle, Calendar as CalendarIcon, ExternalLink,
} from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("content");

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
    published_at: post?.published_at || "",
  });

  // Completion tracker
  const completionPercent = useMemo(() => {
    let filled = 0;
    const total = 8;
    if (formData.title) filled++;
    if (formData.slug) filled++;
    if (formData.content) filled++;
    if (formData.category_id) filled++;
    if (formData.featured_image) filled++;
    if (formData.meta_title) filled++;
    if (formData.meta_description) filled++;
    if (formData.excerpt) filled++;
    return Math.round((filled / total) * 100);
  }, [formData]);

  const wordCount = useMemo(() => {
    if (!formData.content) return 0;
    return formData.content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  }, [formData.content]);

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

  const calculateReadingTime = (text: string): number => {
    const wordsPerMinute = 200;
    const wc = text.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.ceil(wc / wordsPerMinute);
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
      published_at: formData.is_published
        ? (formData.published_at || new Date().toISOString())
        : null,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border -mx-4 px-4 py-3 md:-mx-6 md:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-2">
              {completionPercent === 100 ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              )}
              <span className="text-sm font-medium">{completionPercent}%</span>
            </div>
            <Progress value={completionPercent} className="w-24 h-2" />
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={formData.is_published ? "default" : "secondary"}
              className="text-xs"
            >
              {formData.is_published ? "Published" : "Draft"}
            </Badge>
            {formData.is_featured && (
              <Badge variant="outline" className="text-xs border-secondary text-secondary">Featured</Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {mode === "edit" && post?.slug && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 hidden sm:flex"
              onClick={() => window.open(`/blog/${post.slug}`, "_blank")}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Preview
            </Button>
          )}
          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-1.5">
            <Label htmlFor="quick-publish" className="text-xs cursor-pointer">Publish</Label>
            <Switch
              id="quick-publish"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_published: checked }))}
            />
          </div>
          <Button type="submit" disabled={isSubmitting} size="sm" className="gap-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start bg-muted/50 h-11">
          <TabsTrigger value="content" className="gap-1.5 data-[state=active]:bg-background">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="gap-1.5 data-[state=active]:bg-background">
            <Image className="w-4 h-4" />
            <span className="hidden sm:inline">Media</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-1.5 data-[state=active]:bg-background">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1.5 data-[state=active]:bg-background">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Post Details</CardTitle>
              <CardDescription>Title, slug, and main content for your blog post</CardDescription>
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
                  {wordCount > 0 && (
                    <p className="text-xs text-muted-foreground">{wordCount.toLocaleString()} words · ~{calculateReadingTime(formData.content)} min read</p>
                  )}
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
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
              <CardDescription>The main image displayed at the top of your blog post and in social shares</CardDescription>
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
                <div className="space-y-4">
                  <div className="relative w-full h-72 rounded-xl overflow-hidden">
                    <img
                      src={formData.featured_image}
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Replace
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="rounded-xl"
                          onClick={() => setFormData((prev) => ({ ...prev, featured_image: "" }))}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground break-all">{formData.featured_image}</p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="w-full h-72 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 hover:border-secondary hover:bg-secondary/5 transition-colors"
                >
                  {isUploadingImage ? (
                    <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center">
                        <Upload className="w-7 h-7 text-muted-foreground" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">Click to upload featured image</p>
                        <p className="text-xs text-muted-foreground mt-1">Recommended: 1200×630px (16:9)</p>
                      </div>
                    </>
                  )}
                </button>
              )}
            </CardContent>
          </Card>

          {/* Image URL input fallback */}
          <Card>
            <CardHeader>
              <CardTitle>Image URL</CardTitle>
              <CardDescription>Or paste an external image URL directly</CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                value={formData.featured_image}
                onChange={(e) => setFormData((prev) => ({ ...prev, featured_image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Tab */}
        <TabsContent value="seo" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Engine Optimization</CardTitle>
              <CardDescription>Optimize how your post appears in search results and social media</CardDescription>
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
                  placeholder="SEO page title (defaults to post title)"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <CharacterCounter current={formData.meta_description.length} max={160} />
                </div>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="SEO page description"
                  rows={3}
                />
              </div>

              <KeywordsInput
                keywords={formData.meta_keywords}
                onChange={(keywords) => setFormData((prev) => ({ ...prev, meta_keywords: keywords }))}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search Preview</CardTitle>
              <CardDescription>This is how your post will appear in Google search results</CardDescription>
            </CardHeader>
            <CardContent>
              <SEOPreview
                title={formData.meta_title || formData.title}
                description={formData.meta_description || formData.excerpt}
                slug={formData.slug}
                baseUrl="rentalyachtindubai.com/blog"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Publishing Settings</CardTitle>
              <CardDescription>Control visibility and scheduling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <Label htmlFor="is_published" className="text-sm font-medium">Published</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Make this post visible to the public</p>
                </div>
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_published: checked }))}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                <div>
                  <Label htmlFor="is_featured" className="text-sm font-medium">Featured</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Highlight this post in featured sections</p>
                </div>
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="published_at">
                  <CalendarIcon className="w-4 h-4 inline mr-1.5" />
                  Publish Date
                </Label>
                <Input
                  id="published_at"
                  type="datetime-local"
                  value={formData.published_at ? formData.published_at.slice(0, 16) : ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, published_at: e.target.value ? new Date(e.target.value).toISOString() : "" }))}
                />
                <p className="text-xs text-muted-foreground">Leave empty to use current time when publishing</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add tags to help readers find related content</CardDescription>
            </CardHeader>
            <CardContent>
              <KeywordsInput
                keywords={formData.tags}
                onChange={(tags) => setFormData((prev) => ({ ...prev, tags }))}
              />
            </CardContent>
          </Card>

          {/* Post Info (edit mode) */}
          {mode === "edit" && post && (
            <Card>
              <CardHeader>
                <CardTitle>Post Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Updated</p>
                    <p className="font-medium">{new Date(post.updated_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Views</p>
                    <p className="font-medium">{post.view_count?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Word Count</p>
                    <p className="font-medium">{wordCount.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </form>
  );
};

export default BlogPostForm;
