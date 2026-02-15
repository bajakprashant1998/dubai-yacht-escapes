import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  tourId?: string;
  serviceId?: string;
  className?: string;
  size?: "sm" | "md";
}

const WishlistButton = ({ tourId, serviceId, className, size = "md" }: WishlistButtonProps) => {
  const { isInWishlist, toggleWishlist, userId } = useWishlist();
  const saved = isInWishlist(tourId, serviceId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) {
      // Redirect to auth if not logged in
      window.location.href = "/auth?redirect=" + encodeURIComponent(window.location.pathname);
      return;
    }
    toggleWishlist.mutate({ tourId, serviceId });
  };

  const sizeClasses = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-full flex items-center justify-center transition-all duration-300 shadow-lg z-10",
        saved
          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
          : "bg-card/90 text-muted-foreground hover:bg-card hover:text-destructive",
        sizeClasses,
        className
      )}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn(iconSize, saved && "fill-current")} />
    </button>
  );
};

export default WishlistButton;
