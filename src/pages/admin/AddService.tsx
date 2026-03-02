import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, Layers } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ServiceForm from "@/components/admin/ServiceForm";

const AdminAddService = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/admin" className="hover:text-foreground transition-colors">Dashboard</Link>
          <span>/</span>
          <Link to="/admin/services" className="hover:text-foreground transition-colors">Services</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Add New</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-xl" asChild>
              <Link to="/admin/services">
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                  Add New Service
                </h1>
                <Badge variant="outline" className="gap-1.5 rounded-lg border-secondary/30 text-secondary">
                  <Layers className="w-3.5 h-3.5" />
                  Draft
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                Create a new activity or experience with details, pricing, and booking options
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Auto-save enabled
            </div>
          </div>
        </div>

        {/* Form */}
        <ServiceForm mode="create" />
      </div>
    </AdminLayout>
  );
};

export default AdminAddService;
