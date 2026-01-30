import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import BlogPostForm from "@/components/admin/BlogPostForm";

const AddBlogPost = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/blog">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">New Blog Post</h1>
            <p className="text-muted-foreground">
              Create a new blog post
            </p>
          </div>
        </div>

        <BlogPostForm mode="create" />
      </div>
    </AdminLayout>
  );
};

export default AddBlogPost;
