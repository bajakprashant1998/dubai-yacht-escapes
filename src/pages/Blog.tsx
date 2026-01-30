import Layout from "@/components/layout/Layout";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import BlogCard from "@/components/blog/BlogCard";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogHero from "@/components/blog/BlogHero";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import SEOHead from "@/components/SEOHead";

const Blog = () => {
  const { data: posts = [], isLoading } = useBlogPosts();
  
  const featuredPost = posts.find((post) => post.is_featured);
  const regularPosts = posts.filter((post) => !post.is_featured);

  return (
    <Layout>
      <SEOHead
        title="Dubai Travel Blog"
        description="Discover travel guides, tips, and insider knowledge to make the most of your Dubai adventure. Expert advice on tours, attractions, and experiences."
        canonical="/blog"
        keywords={["Dubai travel blog", "Dubai travel tips", "Dubai guides", "UAE tourism"]}
      />
      <div className="min-h-screen bg-muted/30 pt-32 pb-16">
        <div className="container">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
              <BookOpen className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-4xl font-bold mb-3">Dubai Travel Blog</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover travel guides, tips, and insider knowledge to make the most of your Dubai adventure.
            </p>
          </div>
          
          {/* Featured Post */}
          {isLoading ? (
            <Skeleton className="h-[400px] w-full rounded-2xl mb-12" />
          ) : featuredPost ? (
            <div className="mb-12">
              <BlogHero post={featuredPost} />
            </div>
          ) : null}
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Mobile Category Navigation */}
            <div className="lg:hidden">
              <BlogSidebar />
            </div>
            
            {/* Posts Grid */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              {isLoading ? (
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
              ) : regularPosts.length === 0 && !featuredPost ? (
                <div className="text-center py-16 bg-background rounded-lg">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
                  <p className="text-muted-foreground">
                    Check back soon for travel guides and tips!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regularPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </div>
            
            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:col-span-1 order-1 lg:order-2">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;