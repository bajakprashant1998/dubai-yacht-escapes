import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import TourForm from "@/components/admin/TourForm";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

type Tour = Tables<"tours">;

const EditTour = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTour = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from("tours")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) throw error;
        setTour(data);
      } catch (err: any) {
        console.error("Error fetching tour:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTour();
  }, [slug]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !tour) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-destructive">Tour not found</p>
          <Button asChild>
            <Link to="/admin/tours">Back to Tours</Link>
          </Button>
        </div>
      </AdminLayout>
    );
  }

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
              Edit Tour
            </h1>
            <p className="text-muted-foreground">{tour.title}</p>
          </div>
        </div>

        {/* Form */}
        <TourForm tour={tour} mode="edit" />
      </div>
    </AdminLayout>
  );
};

export default EditTour;
