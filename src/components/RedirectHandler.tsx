import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface RedirectHandlerProps {
  children: React.ReactNode;
}

/**
 * Handles redirects from old URL patterns to new SEO-friendly URLs
 * Checks url_redirects table for configured redirects
 */
const RedirectHandler = ({ children }: RedirectHandlerProps) => {
  const location = useLocation();
  const [redirectTo, setRedirectTo] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkRedirect = async () => {
      // Only check old-format URLs
      if (!location.pathname.startsWith("/tours/")) {
        setChecked(true);
        return;
      }

      setIsChecking(true);

      try {
        // Check if there's a redirect configured for this path
        const { data: redirect } = await supabase
          .from("url_redirects")
          .select("new_path")
          .eq("old_path", location.pathname)
          .single();

        if (redirect?.new_path) {
          // Update hit counter (fire and forget)
          supabase
            .from("url_redirects")
            .update({ hits: supabase.rpc ? undefined : undefined })
            .eq("old_path", location.pathname);

          setRedirectTo(redirect.new_path);
        }
      } catch (error) {
        // No redirect found, continue to regular routing
        console.log("No redirect found for:", location.pathname);
      } finally {
        setIsChecking(false);
        setChecked(true);
      }
    };

    checkRedirect();
  }, [location.pathname]);

  // Show loading while checking redirects
  if (isChecking && !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-md p-8">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  // Perform redirect if one was found
  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default RedirectHandler;
