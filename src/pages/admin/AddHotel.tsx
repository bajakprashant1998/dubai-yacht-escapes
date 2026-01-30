import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import HotelForm from "@/components/admin/HotelForm";

const AddHotel = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/admin/hotels">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Add New Hotel</h1>
            <p className="text-muted-foreground">
              Add a new hotel to your listings
            </p>
          </div>
        </div>

        <HotelForm mode="create" />
      </div>
    </AdminLayout>
  );
};

export default AddHotel;
