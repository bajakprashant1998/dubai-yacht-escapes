import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useBlogPost } from "@/hooks/useBlogPosts";
import BlogSidebar from "@/components/blog/BlogSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, Calendar, Clock, User, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { format } from "date-fns";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || "");
  
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = post?.title || "";
    
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    };
    
    window.open(urls[platform], "_blank", "width=600,height=400");
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen pt-32 pb-16">
          <div className="container max-w-5xl">
            <Skeleton className="h-8 w-48 mb-8" />
            <Skeleton className="aspect-video w-full rounded-xl mb-8" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2" />
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
            <Link to="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <article className="lg:col-span-3">
              {/* Breadcrumb */}
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Blog
              </Link>
              
              {/* Featured Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
                <img
                  src={post.featured_image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                {post.category && (
                  <Link
                    to={`/blog/category/${post.category.slug}`}
                    className="absolute top-4 left-4"
                  >
                    <Badge className="bg-secondary text-secondary-foreground">
                      {post.category.name}
                    </Badge>
                  </Link>
                )}
              </div>
              
              {/* Header */}
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {post.author?.full_name && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.author.full_name}</span>
                    </div>
                  )}
                  {post.published_at && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{format(new Date(post.published_at), "MMMM d, yyyy")}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{post.reading_time} min read</span>
                  </div>
                </div>
              </header>
              
              {/* Content */}
              <div 
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />
              
              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b">
                  {post.tags.map((tag) => (
                    <Link key={tag} to={`/blog/tag/${tag}`}>
                      <Badge variant="outline" className="hover:bg-muted">
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
              
              {/* Share */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share:
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare("facebook")}
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare("twitter")}
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleShare("linkedin")}
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </article>
            
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <BlogSidebar />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;