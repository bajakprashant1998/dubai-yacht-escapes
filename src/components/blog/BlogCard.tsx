import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlogPost } from "@/hooks/useBlogPosts";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Link to={`/blog/${post.slug}`} className="block group h-full">
        <div className="card-elevated card-shine bg-card rounded-2xl overflow-hidden hover:-translate-y-2 transition-all duration-500 h-full flex flex-col cursor-pointer">
          {/* Image */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <img
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-50 group-hover:opacity-60 transition-opacity duration-500" />

            {post.is_featured && (
              <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground shadow-lg shadow-secondary/30 font-bold">
                Featured
              </Badge>
            )}
            {post.category && (
              <Badge
                variant="secondary"
                className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-md text-foreground border border-border/30 shadow-md hover:bg-card font-semibold"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/blog/category/${post.category!.slug}`;
                }}
              >
                {post.category.name}
              </Badge>
            )}

            {/* Read time pill on image */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-card/90 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-md border border-border/30">
              <Clock className="w-3 h-3 text-secondary" />
              <span className="text-xs font-bold text-foreground">{post.reading_time} min</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex-1">
              <h3 className="font-display font-bold text-lg group-hover:text-secondary transition-colors duration-300 line-clamp-2 mb-2">
                {post.title}
              </h3>

              {post.excerpt && (
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                {post.published_at && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-secondary" />
                    <span className="text-xs font-medium">{format(new Date(post.published_at), "MMM d, yyyy")}</span>
                  </div>
                )}
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                Read More
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
