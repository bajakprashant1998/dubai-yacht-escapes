import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import VisaForm from "@/components/admin/VisaForm";

const AddVisaService = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/visa-services">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Add Visa Service</h1>
            <p className="text-muted-foreground">
              Create a new visa processing service
            </p>
          </div>
        </div>

        <VisaForm mode="create" />
      </div>
    </AdminLayout>
  );
};

export default AddVisaService;
