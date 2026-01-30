import { useParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useBlogPost } from "@/hooks/useBlogPosts";
import FloatingShareBar from "@/components/blog/FloatingShareBar";
import TableOfContents from "@/components/blog/TableOfContents";
import AuthorBadge from "@/components/blog/AuthorBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Home, Eye } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || "");

  // Add IDs to headings in content for TOC navigation
  useEffect(() => {
    if (post?.content) {
      const contentDiv = document.querySelector(".blog-content");
      if (contentDiv) {
        const headings = contentDiv.querySelectorAll("h2, h3");
        headings.forEach((heading, index) => {
          if (!heading.id) {
            heading.id = `heading-${index}`;
          }
        });
      }
    }
  }, [post?.content]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16">
          <div className="container max-w-6xl">
            <Skeleton className="h-4 w-48 mb-6" />
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <Skeleton className="aspect-[21/9] w-full rounded-2xl mb-12" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Layout>
      <article className="min-h-screen pt-28 pb-16">
        <div className="container max-w-6xl">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              to="/"
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            {post.category && (
              <>
                <ChevronRight className="w-4 h-4" />
                <Link
                  to={`/blog/category/${post.category.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {post.category.name}
                </Link>
              </>
            )}
          </motion.nav>

          {/* Header Section */}
          <header className="mb-10">
            {/* Category Badge */}
            {post.category && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Link to={`/blog/category/${post.category.slug}`}>
                  <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 px-4 py-1.5 text-sm font-medium mb-6">
                    {post.category.name}
                  </Badge>
                </Link>
              </motion.div>
            )}

            {/* Title */}
            <motion.h1
              className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {post.title}
            </motion.h1>

            {/* Excerpt */}
            {post.excerpt && (
              <motion.p
                className="text-lg text-muted-foreground mb-8 max-w-3xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {post.excerpt}
              </motion.p>
            )}

            {/* Author & Meta */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <AuthorBadge
                author={post.author}
                publishedAt={post.published_at}
                readingTime={post.reading_time}
                viewCount={post.view_count}
              />
            </motion.div>
          </header>

          {/* Featured Image */}
          <motion.div
            className="relative aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-xl"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />

            {/* Badges on image */}
            <div className="absolute bottom-4 left-4 flex items-center gap-3">
              {post.category && (
                <Badge className="bg-secondary text-secondary-foreground shadow-lg">
                  {post.category.name}
                </Badge>
              )}
              {post.view_count && post.view_count > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-primary/80 text-primary-foreground backdrop-blur-sm"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  {post.view_count.toLocaleString()} reads
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="grid grid-cols-12 gap-8">
            {/* Floating Share Bar */}
            <div className="col-span-1">
              <FloatingShareBar url={currentUrl} title={post.title} />
            </div>

            {/* Main Content */}
            <motion.div
              className="col-span-12 lg:col-span-8 xl:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div
                className="blog-content prose prose-lg max-w-none 
                  prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
                  prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-border prose-h2:pb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                  prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
                  prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-ul:my-6 prose-li:text-muted-foreground prose-li:mb-2
                  prose-ol:my-6
                  prose-blockquote:border-l-4 prose-blockquote:border-secondary prose-blockquote:bg-muted/30 
                  prose-blockquote:rounded-r-lg prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:not-italic
                  prose-blockquote:text-foreground prose-blockquote:font-medium
                  prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-primary prose-pre:text-primary-foreground prose-pre:rounded-xl prose-pre:p-6
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
                  
                  [&_.blog-card]:bg-card [&_.blog-card]:rounded-xl [&_.blog-card]:border [&_.blog-card]:border-border 
                  [&_.blog-card]:p-6 [&_.blog-card]:mb-6 [&_.blog-card]:shadow-sm
                  [&_.card-heading]:text-xl [&_.card-heading]:font-bold [&_.card-heading]:text-foreground [&_.card-heading]:mb-4 [&_.card-heading]:flex [&_.card-heading]:items-center [&_.card-heading]:gap-2
                  [&_.card-bullets]:list-none [&_.card-bullets]:pl-0 [&_.card-bullets]:space-y-2
                  [&_.card-bullets_li]:flex [&_.card-bullets_li]:items-start [&_.card-bullets_li]:gap-2 [&_.card-bullets_li]:text-muted-foreground
                  [&_.card-bullets_li]:before:content-['✓'] [&_.card-bullets_li]:before:text-secondary [&_.card-bullets_li]:before:font-bold
                  [&_.card-highlight]:bg-secondary/10 [&_.card-highlight]:border-l-4 [&_.card-highlight]:border-secondary 
                  [&_.card-highlight]:rounded-r-lg [&_.card-highlight]:p-4 [&_.card-highlight]:mt-4 
                  [&_.card-highlight]:text-foreground [&_.card-highlight]:font-medium [&_.card-highlight]:text-sm
                  [&_.card-takeaway]:bg-muted [&_.card-takeaway]:rounded-lg [&_.card-takeaway]:p-3 [&_.card-takeaway]:mt-3
                  [&_.card-takeaway]:text-sm [&_.card-takeaway]:text-muted-foreground [&_.card-takeaway]:italic
                "
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
                  <span className="text-sm font-medium text-muted-foreground mr-2">
                    Tags:
                  </span>
                  {post.tags.map((tag) => (
                    <Link key={tag} to={`/blog/tag/${tag}`}>
                      <Badge
                        variant="outline"
                        className="hover:bg-muted transition-colors"
                      >
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              {/* Back to Blog */}
              <div className="mt-12 pt-8 border-t border-border">
                <Link to="/blog">
                  <Button variant="outline" className="group">
                    <ChevronLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to All Articles
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Table of Contents */}
            <div className="hidden xl:block col-span-3">
              <TableOfContents content={post.content || ""} />
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
