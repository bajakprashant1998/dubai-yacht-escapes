import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CarForm from "@/components/admin/CarForm";
import { useCarRental } from "@/hooks/useCarRentals";

const EditCarRental = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: car, isLoading, isError } = useCarRental(slug || "");

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

  if (isError || !car) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-semibold mb-2">Car not found</h2>
          <p className="text-muted-foreground mb-4">
            The car you're looking for doesn't exist.
          </p>
          <Link to="/admin/car-rentals">
            <Button>Back to Cars</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

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
            <h1 className="text-2xl font-bold">Edit Car</h1>
            <p className="text-muted-foreground">{car.title}</p>
          </div>
        </div>

        <CarForm car={car} mode="edit" />
      </div>
    </AdminLayout>
  );
};

export default EditCarRental;
