import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import HotelForm from "@/components/admin/HotelForm";
import { useHotel } from "@/hooks/useHotels";

const EditHotel = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: hotel, isLoading, isError } = useHotel(slug || "");

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </AdminLayout>
    );
  }

  if (isError || !hotel) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-semibold mb-2">Hotel not found</h2>
          <p className="text-muted-foreground mb-4">
            The hotel you're looking for doesn't exist.
          </p>
          <Link to="/admin/hotels">
            <Button>Back to Hotels</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

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
            <h1 className="text-2xl font-bold">Edit Hotel</h1>
            <p className="text-muted-foreground">{hotel.name}</p>
          </div>
        </div>

        <HotelForm hotel={hotel} mode="edit" />
      </div>
    </AdminLayout>
  );
};

export default EditHotel;
