import { Link } from "react-router-dom";
import { useBlogCategories } from "@/hooks/useBlogCategories";
import { useBlogTags } from "@/hooks/useBlogTags";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const BlogSidebar = () => {
  const { data: categories = [], isLoading: loadingCategories } = useBlogCategories();
  const { data: tags = [], isLoading: loadingTags } = useBlogTags();
  const { data: recentPosts = [], isLoading: loadingPosts } = useBlogPosts();

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loadingCategories ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))
          ) : (
            categories.map((category) => (
              <Link
                key={category.id}
                to={`/blog/category/${category.slug}`}
                className="block px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
              >
                {category.name}
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingPosts ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-16 h-16 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))
          ) : (
            recentPosts.slice(0, 5).map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="flex gap-3 group"
              >
                <img
                  src={post.featured_image || "/placeholder.svg"}
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h4 className="text-sm font-medium line-clamp-2 group-hover:text-secondary transition-colors">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {post.reading_time} min read
                  </p>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTags ? (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-16" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link key={tag.id} to={`/blog/tag/${tag.slug}`}>
                  <Badge variant="outline" className="hover:bg-muted cursor-pointer">
                    {tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogSidebar;