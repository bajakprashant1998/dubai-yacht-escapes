import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SEOHead, { createBreadcrumbSchema, createFAQSchema } from "@/components/SEOHead";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import FloatingShareBar from "@/components/blog/FloatingShareBar";
import TableOfContents from "@/components/blog/TableOfContents";
import AuthorBadge from "@/components/blog/AuthorBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Eye,
  ArrowRight,
  BookOpen,
  Clock,
  Calendar,
  MessageCircle,
  Mail,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Transform plain HTML content into card-style sections
const transformContentToCards = (html: string): string => {
  if (!html) return "";
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;
  const children = Array.from(body.children);
  if (children.length === 0) return html;

  let result = "";
  let currentCard: string[] = [];
  let cardIndex = 0;

  const flushCard = () => {
    if (currentCard.length > 0) {
      const cardColors = [
        "border-l-secondary",
        "border-l-primary",
        "border-l-amber-500",
        "border-l-emerald-500",
        "border-l-blue-500",
        "border-l-purple-500",
      ];
      const colorClass = cardColors[cardIndex % cardColors.length];
      result += `<div class="content-card ${colorClass}">${currentCard.join("")}</div>`;
      currentCard = [];
      cardIndex++;
    }
  };

  children.forEach((child) => {
    const tagName = child.tagName.toLowerCase();
    if (tagName === "h2" || tagName === "h3") {
      flushCard();
    }
    currentCard.push(child.outerHTML);
  });
  flushCard();
  return result;
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || "");
  const { data: allPosts = [] } = useBlogPosts();
  const [readProgress, setReadProgress] = useState(0);
  const [email, setEmail] = useState("");

  // Reading progress
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      setReadProgress(Math.min((scrollTop / docHeight) * 100, 100));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const cardContent = useMemo(() => {
    return post?.content ? transformContentToCards(post.content) : "";
  }, [post?.content]);

  // Add IDs to headings for TOC
  useEffect(() => {
    if (post?.content) {
      const contentDiv = document.querySelector(".blog-content");
      if (contentDiv) {
        const headings = contentDiv.querySelectorAll("h2, h3");
        headings.forEach((heading, index) => {
          if (!heading.id) heading.id = `heading-${index}`;
        });
      }
    }
  }, [post?.content]);

  // Related posts
  const relatedPosts = useMemo(() => {
    if (!post || !allPosts.length) return [];
    return allPosts
      .filter((p) => p.id !== post.id && (p.category_id === post.category_id || p.tags?.some((t) => post.tags?.includes(t))))
      .slice(0, 3);
  }, [post, allPosts]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen">
          <Skeleton className="h-[50vh] w-full" />
          <div className="container max-w-6xl py-8 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-8 space-y-4">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>
              <div className="col-span-4 hidden xl:block">
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            </div>
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
            <BookOpen className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Link to="/blog">
              <Button className="rounded-xl">Back to Blog</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const publishDate = post.published_at ? format(new Date(post.published_at), "MMMM d, yyyy") : "";
  const authorName = post.author?.full_name || "Betterview Team";

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    ...(post.category ? [{ name: post.category.name, url: `/blog/category/${post.category.slug}` }] : []),
    { name: post.title, url: `/blog/${post.slug}` },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.meta_description || "",
    image: post.featured_image || "",
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
      name: "Betterview Tourism",
      logo: { "@type": "ImageObject", url: "https://rentalyachtindubai.com/betterview-logo.png" },
    },
  };

  return (
    <Layout>
      <SEOHead
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt || `Read "${post.title}" on the Betterview Tourism blog.`}
        canonical={`/blog/${post.slug}`}
        image={post.featured_image || undefined}
        type="article"
        structuredData={[createBreadcrumbSchema(breadcrumbs), articleSchema]}
        keywords={post.meta_keywords?.length ? post.meta_keywords : post.tags}
      />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-transparent">
        <motion.div
          className="h-full bg-secondary"
          style={{ width: `${readProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Cinematic Hero */}
      <section className="relative h-[50vh] md:h-[55vh] overflow-hidden bg-primary">
        <motion.img
          src={post.featured_image || "/placeholder.svg"}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        {/* Breadcrumb */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-24 md:pt-28">
          <div className="container max-w-6xl">
            <nav className="flex items-center gap-2 text-sm text-white/60">
              <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
                <Home className="w-3.5 h-3.5" /> Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
              {post.category && (
                <>
                  <ChevronRight className="w-3 h-3" />
                  <Link to={`/blog/category/${post.category.slug}`} className="hover:text-white transition-colors">
                    {post.category.name}
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="container max-w-6xl pb-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              {post.category && (
                <Link to={`/blog/category/${post.category.slug}`}>
                  <Badge className="bg-secondary/90 text-secondary-foreground rounded-lg text-xs mb-4 hover:bg-secondary transition-colors">
                    {post.category.name}
                  </Badge>
                </Link>
              )}
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight max-w-4xl">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-base md:text-lg text-white/70 mb-5 max-w-3xl line-clamp-2">
                  {post.excerpt}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white/90">
                  {post.author?.full_name ? (
                    <div className="w-6 h-6 rounded-full bg-secondary/30 flex items-center justify-center text-[10px] font-bold text-secondary">
                      {authorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                  ) : null}
                  <span>{authorName}</span>
                </div>
                {publishDate && (
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white/80">
                    <Calendar className="w-3.5 h-3.5" />
                    {publishDate}
                  </div>
                )}
                {post.reading_time > 0 && (
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white/80">
                    <Clock className="w-3.5 h-3.5" />
                    {post.reading_time} min read
                  </div>
                )}
                {post.view_count > 0 && (
                  <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white/80">
                    <Eye className="w-3.5 h-3.5" />
                    {post.view_count.toLocaleString()} reads
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <article className="min-h-screen bg-muted/30 py-10 pb-16">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-12 gap-8">
            {/* Floating Share Bar */}
            <div className="col-span-1 hidden lg:block">
              <FloatingShareBar url={currentUrl} title={post.title} />
            </div>

            {/* Content */}
            <motion.div
              className="col-span-12 lg:col-span-8 xl:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div
                className="blog-content prose prose-lg max-w-none 
                  prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
                  prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-primary prose-pre:text-primary-foreground prose-pre:rounded-xl prose-pre:p-6
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:my-4
                  
                  [&_.content-card]:relative [&_.content-card]:bg-card [&_.content-card]:rounded-xl 
                  [&_.content-card]:border [&_.content-card]:border-border/50 [&_.content-card]:border-l-4
                  [&_.content-card]:p-6 [&_.content-card]:mb-6 [&_.content-card]:shadow-sm
                  [&_.content-card]:hover:shadow-md [&_.content-card]:transition-all [&_.content-card]:duration-300
                  [&_.content-card]:hover:translate-y-[-2px]
                  
                  [&_.content-card_h2]:text-xl [&_.content-card_h2]:md:text-2xl [&_.content-card_h2]:font-bold 
                  [&_.content-card_h2]:text-foreground [&_.content-card_h2]:mb-4 [&_.content-card_h2]:mt-0
                  [&_.content-card_h2]:flex [&_.content-card_h2]:items-center [&_.content-card_h2]:gap-3
                  [&_.content-card_h2]:pb-3 [&_.content-card_h2]:border-b [&_.content-card_h2]:border-border/50
                  
                  [&_.content-card_h3]:text-lg [&_.content-card_h3]:font-semibold [&_.content-card_h3]:text-foreground 
                  [&_.content-card_h3]:mb-3 [&_.content-card_h3]:mt-0 [&_.content-card_h3]:flex [&_.content-card_h3]:items-center [&_.content-card_h3]:gap-2
                  
                  [&_.content-card_p]:text-muted-foreground [&_.content-card_p]:leading-relaxed 
                  [&_.content-card_p]:mb-4 [&_.content-card_p]:last:mb-0 [&_.content-card_p]:text-[15px]
                  
                  [&_.content-card_ul]:my-4 [&_.content-card_ul]:space-y-2 [&_.content-card_ul]:pl-0 [&_.content-card_ul]:list-none
                  [&_.content-card_li]:flex [&_.content-card_li]:items-start [&_.content-card_li]:gap-3 
                  [&_.content-card_li]:text-muted-foreground [&_.content-card_li]:text-[15px]
                  [&_.content-card_li]:before:content-['→'] [&_.content-card_li]:before:text-secondary 
                  [&_.content-card_li]:before:font-bold [&_.content-card_li]:before:mt-0.5
                  
                  [&_.content-card_ol]:my-4 [&_.content-card_ol]:space-y-2 [&_.content-card_ol]:list-decimal [&_.content-card_ol]:pl-5
                  [&_.content-card_ol_li]:text-muted-foreground [&_.content-card_ol_li]:text-[15px] [&_.content-card_ol_li]:pl-2
                  
                  [&_.content-card_blockquote]:bg-muted/50 [&_.content-card_blockquote]:border-l-4 
                  [&_.content-card_blockquote]:border-secondary [&_.content-card_blockquote]:rounded-r-lg 
                  [&_.content-card_blockquote]:py-3 [&_.content-card_blockquote]:px-4 [&_.content-card_blockquote]:my-4
                  [&_.content-card_blockquote]:not-italic [&_.content-card_blockquote]:text-foreground/90
                  
                  [&_.border-l-secondary]:border-l-secondary
                  [&_.border-l-primary]:border-l-primary
                  [&_.border-l-amber-500]:border-l-amber-500
                  [&_.border-l-emerald-500]:border-l-emerald-500
                  [&_.border-l-blue-500]:border-l-blue-500
                  [&_.border-l-purple-500]:border-l-purple-500
                "
                dangerouslySetInnerHTML={{ __html: cardContent }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
                  <span className="text-sm font-medium text-muted-foreground mr-2">Tags:</span>
                  {post.tags.map((tag) => (
                    <Link key={tag} to={`/blog/tag/${tag}`}>
                      <Badge variant="outline" className="hover:bg-muted transition-colors rounded-lg">
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              {/* Newsletter CTA */}
              <motion.div
                className="mt-12 bg-card rounded-xl border border-border/50 p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Enjoyed this article?</h3>
                <p className="text-muted-foreground text-sm mb-5 max-w-md mx-auto">
                  Get exclusive Dubai travel tips, deals, and insider guides delivered to your inbox weekly.
                </p>
                <div className="flex gap-2 max-w-sm mx-auto">
                  <Input
                    placeholder="Your email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl bg-muted/50"
                  />
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl shrink-0">
                    Subscribe
                  </Button>
                </div>
              </motion.div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <motion.section
                  className="mt-12 pt-8 border-t border-border"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" />
                    You Might Also Like
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedPosts.map((rp) => (
                      <Link key={rp.id} to={`/blog/${rp.slug}`} className="group">
                        <Card className="overflow-hidden rounded-xl border-border/50 hover:shadow-lg transition-all duration-300 h-full">
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <img
                              src={rp.featured_image || "/placeholder.svg"}
                              alt={rp.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            {rp.category && (
                              <Badge className="absolute bottom-2 left-2 bg-secondary/90 text-secondary-foreground text-xs rounded-lg">
                                {rp.category.name}
                              </Badge>
                            )}
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-sm group-hover:text-secondary transition-colors line-clamp-2 mb-2">
                              {rp.title}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              {rp.reading_time > 0 && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {rp.reading_time} min
                                </span>
                              )}
                              {rp.view_count > 0 && (
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" /> {rp.view_count.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Back to Blog */}
              <div className="mt-12 pt-8 border-t border-border">
                <Link to="/blog">
                  <Button variant="outline" className="group rounded-xl">
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

      {/* Mobile Share Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/95 backdrop-blur-md border-t border-border p-3 pb-safe">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground truncate">{post.title}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.reading_time} min</span>
              <span>•</span>
              <span>{Math.round(readProgress)}% read</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="rounded-xl h-9"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: post.title, url: currentUrl });
                } else {
                  navigator.clipboard.writeText(currentUrl);
                }
              }}
            >
              Share
            </Button>
            <Button
              size="sm"
              className="bg-secondary text-secondary-foreground rounded-xl h-9"
              onClick={() => {
                const msg = encodeURIComponent(`Hi! I just read "${post.title}" and I'd like to know more about this experience.`);
                window.open(`https://wa.me/971509254594?text=${msg}`, "_blank");
              }}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Chat
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;
