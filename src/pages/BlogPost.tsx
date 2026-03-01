import { useParams, Link } from "react-router-dom";
import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SEOHead, { createBreadcrumbSchema } from "@/components/SEOHead";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import FloatingShareBar from "@/components/blog/FloatingShareBar";
import TableOfContents from "@/components/blog/TableOfContents";
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
  TrendingUp,
  FileText,
  Tag,
} from "lucide-react";
import { format } from "date-fns";

// Transform plain HTML content into numbered card-style sections
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
      const num = cardIndex + 1;
      result += `<div class="content-card" data-section="${num}">
        <div class="section-number">${num}</div>
        ${currentCard.join("")}
      </div>`;
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

// Word count helper
const countWords = (html: string): number => {
  if (!html) return 0;
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.split(" ").filter(Boolean).length;
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useBlogPost(slug || "");
  const { data: allPosts = [] } = useBlogPosts();
  const [readProgress, setReadProgress] = useState(0);
  const [email, setEmail] = useState("");

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

  const wordCount = useMemo(() => {
    return post?.content ? countWords(post.content) : 0;
  }, [post?.content]);

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

  const relatedPosts = useMemo(() => {
    if (!post || !allPosts.length) return [];
    return allPosts
      .filter((p) => p.id !== post.id && (p.category_id === post.category_id || p.tags?.some((t) => post.tags?.includes(t))))
      .slice(0, 3);
  }, [post, allPosts]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-muted/30">
          <div className="bg-background pt-28 pb-12">
            <div className="container max-w-4xl space-y-6">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-14 w-3/4" />
              <Skeleton className="h-6 w-2/3" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-40 rounded-full" />
                <Skeleton className="h-10 w-28 rounded-full" />
                <Skeleton className="h-10 w-28 rounded-full" />
              </div>
            </div>
          </div>
          <div className="container max-w-6xl py-8">
            <Skeleton className="h-80 w-full max-w-3xl rounded-2xl" />
            <div className="mt-8 space-y-6">
              <Skeleton className="h-40 w-full max-w-3xl rounded-xl" />
              <Skeleton className="h-40 w-full max-w-3xl rounded-xl" />
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

      {/* Clean Editorial Hero - Light Background */}
      <section className="bg-gradient-to-b from-primary/5 via-primary/3 to-background pt-24 md:pt-28 pb-8 md:pb-12">
        <div className="container max-w-4xl">
          {/* Breadcrumb */}
          <motion.nav
            className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="hover:text-foreground transition-colors flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            {post.category && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link to={`/blog/category/${post.category.slug}`} className="text-secondary font-medium hover:text-secondary/80 transition-colors">
                  {post.category.name}
                </Link>
              </>
            )}
          </motion.nav>

          {/* Category Badge */}
          {post.category && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mb-5"
            >
              <Link to={`/blog/category/${post.category.slug}`}>
                <Badge className="bg-secondary/10 text-secondary border border-secondary/20 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-secondary/20 transition-colors gap-2">
                  <Tag className="w-3.5 h-3.5" />
                  {post.category.name}
                </Badge>
              </Link>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            className="text-3xl md:text-5xl lg:text-[3.25rem] font-display font-bold text-foreground leading-tight mb-5 max-w-3xl"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          {post.excerpt && (
            <motion.p
              className="text-lg text-muted-foreground leading-relaxed mb-7 max-w-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {post.excerpt}
            </motion.p>
          )}

          {/* Author & Meta Pills */}
          <motion.div
            className="flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
          >
            {/* Author Card */}
            <div className="flex items-center gap-3 bg-card border border-border/60 rounded-full px-4 py-2 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center text-xs font-bold text-secondary">
                {authorName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground leading-tight">{authorName}</div>
                <div className="text-xs text-muted-foreground">Expert Team</div>
              </div>
            </div>

            {publishDate && (
              <div className="flex items-center gap-2 bg-card border border-border/60 rounded-full px-4 py-2.5 text-sm text-muted-foreground shadow-sm">
                <Calendar className="w-4 h-4 text-secondary/70" />
                {publishDate}
              </div>
            )}
            {post.reading_time > 0 && (
              <div className="flex items-center gap-2 bg-card border border-border/60 rounded-full px-4 py-2.5 text-sm text-muted-foreground shadow-sm">
                <Clock className="w-4 h-4 text-secondary/70" />
                {post.reading_time} min read
              </div>
            )}
            {wordCount > 0 && (
              <div className="flex items-center gap-2 bg-card border border-border/60 rounded-full px-4 py-2.5 text-sm text-muted-foreground shadow-sm">
                <Eye className="w-4 h-4 text-secondary/70" />
                {wordCount.toLocaleString()} words
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Image Card */}
      <section className="bg-muted/30 pt-6 pb-2">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-12 gap-8">
            {/* Spacer for share bar alignment */}
            <div className="col-span-1 hidden lg:block" />

            {/* Image Card */}
            <motion.div
              className="col-span-12 lg:col-span-8 xl:col-span-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg group">
                <img
                  src={post.featured_image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-full aspect-[16/9] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Overlay badges */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-semibold shadow-lg gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    Premium
                  </Badge>
                </div>
                
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  <Badge className="bg-white/15 backdrop-blur-md text-white border border-white/20 rounded-full px-3 py-1.5 text-xs gap-1.5">
                    <TrendingUp className="w-3 h-3" />
                    Expert Analysis
                  </Badge>
                  {post.reading_time > 0 && (
                    <Badge className="bg-white/15 backdrop-blur-md text-white border border-white/20 rounded-full px-3 py-1.5 text-xs gap-1.5">
                      <Clock className="w-3 h-3" />
                      {post.reading_time} min read
                    </Badge>
                  )}
                  {post.category && (
                    <Badge className="bg-white/15 backdrop-blur-md text-white border border-white/20 rounded-full px-3 py-1.5 text-xs gap-1.5">
                      <FileText className="w-3 h-3" />
                      {post.category.name}
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Table of Contents Preview (desktop) */}
            <div className="hidden xl:block col-span-3">
              <TableOfContents content={post.content || ""} />
            </div>
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
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <div
                className="blog-content prose prose-lg max-w-none 
                  prose-headings:font-display prose-headings:font-bold prose-headings:text-foreground
                  prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                  prose-pre:bg-primary prose-pre:text-primary-foreground prose-pre:rounded-xl prose-pre:p-6
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:my-4
                  
                  [&_.content-card]:relative [&_.content-card]:bg-card [&_.content-card]:rounded-2xl 
                  [&_.content-card]:border [&_.content-card]:border-border/40
                  [&_.content-card]:p-7 [&_.content-card]:pl-16 [&_.content-card]:mb-6 
                  [&_.content-card]:shadow-sm [&_.content-card]:hover:shadow-md 
                  [&_.content-card]:transition-all [&_.content-card]:duration-300
                  [&_.content-card]:hover:border-secondary/30

                  [&_.section-number]:absolute [&_.section-number]:left-5 [&_.section-number]:top-7
                  [&_.section-number]:w-8 [&_.section-number]:h-8 [&_.section-number]:rounded-full
                  [&_.section-number]:bg-secondary/10 [&_.section-number]:text-secondary
                  [&_.section-number]:flex [&_.section-number]:items-center [&_.section-number]:justify-center
                  [&_.section-number]:text-sm [&_.section-number]:font-bold
                  [&_.section-number]:border [&_.section-number]:border-secondary/20
                  
                  [&_.content-card_h2]:text-xl [&_.content-card_h2]:md:text-2xl [&_.content-card_h2]:font-bold 
                  [&_.content-card_h2]:text-foreground [&_.content-card_h2]:mb-4 [&_.content-card_h2]:mt-0
                  [&_.content-card_h2]:pb-3 [&_.content-card_h2]:border-b [&_.content-card_h2]:border-border/40
                  
                  [&_.content-card_h3]:text-lg [&_.content-card_h3]:font-semibold [&_.content-card_h3]:text-foreground 
                  [&_.content-card_h3]:mb-3 [&_.content-card_h3]:mt-0
                  
                  [&_.content-card_p]:text-muted-foreground [&_.content-card_p]:leading-relaxed 
                  [&_.content-card_p]:mb-4 [&_.content-card_p]:last:mb-0 [&_.content-card_p]:text-[15px]
                  
                  [&_.content-card_ul]:my-4 [&_.content-card_ul]:space-y-2.5 [&_.content-card_ul]:pl-0 [&_.content-card_ul]:list-none
                  [&_.content-card_li]:flex [&_.content-card_li]:items-start [&_.content-card_li]:gap-3 
                  [&_.content-card_li]:text-muted-foreground [&_.content-card_li]:text-[15px]
                  [&_.content-card_li]:before:content-['→'] [&_.content-card_li]:before:text-secondary 
                  [&_.content-card_li]:before:font-bold [&_.content-card_li]:before:mt-0.5
                  
                  [&_.content-card_ol]:my-4 [&_.content-card_ol]:space-y-2 [&_.content-card_ol]:list-decimal [&_.content-card_ol]:pl-5
                  [&_.content-card_ol_li]:text-muted-foreground [&_.content-card_ol_li]:text-[15px] [&_.content-card_ol_li]:pl-2
                  
                  [&_.content-card_blockquote]:bg-secondary/5 [&_.content-card_blockquote]:border-l-4 
                  [&_.content-card_blockquote]:border-secondary [&_.content-card_blockquote]:rounded-r-xl 
                  [&_.content-card_blockquote]:py-4 [&_.content-card_blockquote]:px-5 [&_.content-card_blockquote]:my-5
                  [&_.content-card_blockquote]:not-italic [&_.content-card_blockquote]:text-foreground/90
                  [&_.content-card_blockquote]:font-medium
                "
                dangerouslySetInnerHTML={{ __html: cardContent }}
              />

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
                  <span className="text-sm font-medium text-muted-foreground mr-2">Tags:</span>
                  {post.tags.map((tag) => (
                    <Link key={tag} to={`/blog/tag/${tag}`}>
                      <Badge variant="outline" className="hover:bg-secondary/10 hover:text-secondary hover:border-secondary/30 transition-colors rounded-full px-3">
                        #{tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}

              {/* CTA Card - "Have questions about this article?" */}
              <motion.div
                className="mt-10 bg-card rounded-2xl border border-border/50 p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-xl font-bold mb-2">Have questions about this article?</h3>
                <p className="text-muted-foreground text-sm mb-5">
                  Our team of travel experts is here to help you plan your perfect Dubai experience.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/contact">
                    <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-xl gap-2">
                      Get Expert Help <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/services">
                    <Button variant="outline" className="rounded-xl">
                      Explore Services
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Newsletter CTA */}
              <motion.div
                className="mt-8 bg-gradient-to-br from-secondary/5 via-card to-primary/5 rounded-2xl border border-border/50 p-8 text-center"
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
                    className="rounded-xl bg-background"
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
                  <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-secondary" />
                    Recommended Reading
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">Continue learning with related articles</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedPosts.map((rp) => (
                      <Link key={rp.id} to={`/blog/${rp.slug}`} className="group">
                        <Card className="overflow-hidden rounded-2xl border-border/40 hover:shadow-lg hover:border-secondary/30 transition-all duration-300 h-full">
                          <div className="relative aspect-[16/10] overflow-hidden">
                            <img
                              src={rp.featured_image || "/placeholder.svg"}
                              alt={rp.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            {rp.category && (
                              <Badge className="absolute bottom-2 left-2 bg-white/15 backdrop-blur-md text-white border border-white/20 text-xs rounded-full">
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
                              {rp.published_at && (
                                <span>{format(new Date(rp.published_at), "MMM d")}</span>
                              )}
                              <span className="ml-auto text-secondary text-xs font-medium">Read More</span>
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

            {/* TOC sidebar (hidden on xl since it's shown above) */}
            <div className="hidden xl:hidden lg:block col-span-3">
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
