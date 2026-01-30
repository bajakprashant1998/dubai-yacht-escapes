import { Link } from "react-router-dom";
import { Calendar, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/hooks/useBlogPosts";
import { format } from "date-fns";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 h-full flex flex-col">
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={post.featured_image || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {post.is_featured && (
          <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground">
            Featured
          </Badge>
        )}
        {post.category && (
          <Link
            to={`/blog/category/${post.category.slug}`}
            className="absolute bottom-3 left-3"
          >
            <Badge variant="secondary" className="hover:bg-secondary/80">
              {post.category.name}
            </Badge>
          </Link>
        )}
      </div>
      
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <Link to={`/blog/${post.slug}`}>
            <h3 className="font-semibold text-lg group-hover:text-secondary transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>
          
          {post.excerpt && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
              {post.excerpt}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-muted-foreground">
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
      </CardContent>
    </Card>
  );
};

export default BlogCard;