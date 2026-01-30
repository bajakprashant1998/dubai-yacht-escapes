import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import ServiceForm from "@/components/admin/ServiceForm";

const AdminAddService = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/services">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Add New Service</h1>
            <p className="text-muted-foreground">Create a new activity or experience</p>
          </div>
        </div>
        <ServiceForm mode="create" />
      </div>
    </AdminLayout>
  );
};

export default AdminAddService;
