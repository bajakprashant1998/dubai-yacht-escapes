import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import BlogCard from "@/components/blog/BlogCard";
import BlogSidebar from "@/components/blog/BlogSidebar";
import BlogHero from "@/components/blog/BlogHero";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

      {/* Hero Section */}
      <section className="relative bg-primary py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>
        <div className="absolute top-16 left-[10%] w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-[15%] w-56 h-56 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30 text-sm px-4 py-2">
              <BookOpen className="w-4 h-4 mr-2" />
              Travel Guides & Tips
            </Badge>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Dubai Travel Blog
          </motion.h1>
          <motion.p
            className="text-lg text-primary-foreground/80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover travel guides, tips, and insider knowledge to make the most of your Dubai adventure.
          </motion.p>
        </div>
      </section>

      <div className="min-h-screen bg-muted/30 py-12 pb-16">
        <div className="container">
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
                <motion.div
                  className="text-center py-16 bg-card rounded-xl border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No blog posts yet</h3>
                  <p className="text-muted-foreground">
                    Check back soon for travel guides and tips!
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {regularPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <BlogCard post={post} />
                    </motion.div>
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
