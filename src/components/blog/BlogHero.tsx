import { Link } from "react-router-dom";
import { Clock, User, Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogPost } from "@/hooks/useBlogPosts";
import { format } from "date-fns";

interface BlogHeroProps {
  post: BlogPost;
}

const BlogHero = ({ post }: BlogHeroProps) => {
  return (
    <div className="relative rounded-2xl overflow-hidden h-[400px] md:h-[500px]">
      <img
        src={post.featured_image || "/placeholder.svg"}
        alt={post.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
        {post.category && (
          <Link to={`/blog/category/${post.category.slug}`}>
            <Badge className="bg-secondary text-secondary-foreground mb-4">
              {post.category.name}
            </Badge>
          </Link>
        )}
        
        <Link to={`/blog/${post.slug}`}>
          <h2 className="text-2xl md:text-4xl font-bold mb-3 hover:text-secondary transition-colors">
            {post.title}
          </h2>
        </Link>
        
        {post.excerpt && (
          <p className="text-white/80 mb-4 max-w-2xl line-clamp-2 md:line-clamp-3">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
          {post.author?.full_name && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{post.author.full_name}</span>
            </div>
          )}
          {post.published_at && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.published_at), "MMM d, yyyy")}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.reading_time} min read</span>
          </div>
        </div>
        
        <Link to={`/blog/${post.slug}`} className="inline-block mt-4">
          <Button variant="secondary" className="group">
            Read Article
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BlogHero;