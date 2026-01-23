import AdminLayout from "@/components/admin/AdminLayout";
import TourForm from "@/components/admin/TourForm";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AddTour = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/admin/tours">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              Add New Tour
            </h1>
            <p className="text-muted-foreground">
              Create a new tour package
            </p>
          </div>
        </div>

        {/* Form */}
        <TourForm mode="create" />
      </div>
    </AdminLayout>
  );
};

export default AddTour;
