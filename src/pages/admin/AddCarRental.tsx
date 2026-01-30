import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import CarForm from "@/components/admin/CarForm";

const AddCarRental = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/car-rentals">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Add New Car</h1>
            <p className="text-muted-foreground">
              Add a new car to your rental fleet
            </p>
          </div>
        </div>

        <CarForm mode="create" />
      </div>
    </AdminLayout>
  );
};

export default AddCarRental;
