import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import VisaForm from "@/components/admin/VisaForm";
import { useVisaService } from "@/hooks/useVisaServices";

const EditVisaService = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: visa, isLoading, isError } = useVisaService(slug || "");

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

  if (isError || !visa) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-xl font-semibold mb-2">Visa service not found</h2>
          <p className="text-muted-foreground mb-4">
            The visa service you're looking for doesn't exist.
          </p>
          <Link to="/admin/visa-services">
            <Button>Back to Visa Services</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

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
            <h1 className="text-2xl font-bold">Edit Visa Service</h1>
            <p className="text-muted-foreground">{visa.title}</p>
          </div>
        </div>

        <VisaForm visa={visa} mode="edit" />
      </div>
    </AdminLayout>
  );
};

export default EditVisaService;
