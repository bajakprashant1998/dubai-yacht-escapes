import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { useBlogCategories } from "@/hooks/useBlogCategories";
import BlogCard from "@/components/blog/BlogCard";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, FolderOpen } from "lucide-react";

const BlogCategory = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { data: posts = [], isLoading: loadingPosts } = useBlogPosts(categorySlug);
  const { data: categories = [] } = useBlogCategories();
  
  const category = categories.find((c) => c.slug === categorySlug);

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30 pt-32 pb-16">
        <div className="container">
          {/* Breadcrumb */}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
              <FolderOpen className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-4xl font-bold mb-3">
              {category?.name || categorySlug}
            </h1>
            {category?.description && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {category.description}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Posts Grid */}
            <div className="lg:col-span-3">
              {loadingPosts ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[16/9] w-full rounded-lg" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-16 bg-background rounded-lg">
                  <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No posts in this category</h3>
                  <p className="text-muted-foreground mb-4">
                    Check back soon for new content!
                  </p>
                  <Link to="/blog">
                    <Button variant="outline">View All Posts</Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogCategory;