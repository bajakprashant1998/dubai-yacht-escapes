import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ReviewPhoto {
  id: string;
  image_url: string;
  caption: string | null;
  review_id: string;
}

const PhotoReviewsGallery = ({ tourId }: { tourId: string }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: photos = [] } = useQuery({
    queryKey: ["review-photos", tourId],
    queryFn: async (): Promise<ReviewPhoto[]> => {
      const { data: reviews } = await supabase
        .from("reviews")
        .select("id")
        .eq("tour_id", tourId)
        .eq("status", "approved");

      if (!reviews?.length) return [];

      const reviewIds = reviews.map((r) => r.id);
      const { data, error } = await supabase
        .from("review_photos")
        .select("*")
        .in("review_id", reviewIds)
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) throw error;
      return data || [];
    },
    enabled: !!tourId,
  });

  if (!photos.length) return null;

  return (
    <div className="bg-card rounded-xl p-6 shadow-md">
      <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
        <Camera className="w-5 h-5 text-secondary" />
        Guest Photos
        <span className="text-sm font-normal text-muted-foreground">({photos.length})</span>
      </h3>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            onClick={() => setLightboxIndex(index)}
            className="aspect-square rounded-lg overflow-hidden group relative"
          >
            <img
              src={photo.image_url}
              alt={photo.caption || "Guest photo"}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxIndex !== null} onOpenChange={() => setLightboxIndex(null)}>
        <DialogContent className="max-w-4xl p-0 bg-black/95 border-none">
          {lightboxIndex !== null && (
            <div className="relative">
              <img
                src={photos[lightboxIndex].image_url}
                alt={photos[lightboxIndex].caption || "Guest photo"}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              {photos[lightboxIndex].caption && (
                <p className="absolute bottom-4 left-4 right-4 text-white text-sm bg-black/50 rounded-lg px-3 py-2">
                  {photos[lightboxIndex].caption}
                </p>
              )}
              {lightboxIndex > 0 && (
                <button
                  onClick={() => setLightboxIndex(lightboxIndex - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {lightboxIndex < photos.length - 1 && (
                <button
                  onClick={() => setLightboxIndex(lightboxIndex + 1)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoReviewsGallery;
