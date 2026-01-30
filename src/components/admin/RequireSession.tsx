import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { usePermissions } from "@/hooks/usePermissions";
import { Skeleton } from "@/components/ui/skeleton";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface RequireSessionProps {
  children: ReactNode;
  requiredRoles?: AppRole[];
  requiredPermission?: { resource: string; action: string };
}

/**
 * Set BYPASS_AUTH to true for development without authentication.
 * IMPORTANT: This must be false in production.
 */
const BYPASS_AUTH = import.meta.env.DEV && false; // Change to `true` to bypass in dev

export default function RequireSession({ 
  children, 
  requiredRoles,
  requiredPermission,
}: RequireSessionProps) {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { hasPermission, hasAnyRole, isLoading: permissionsLoading, userRoles } = usePermissions();

  useEffect(() => {
    // Bypass auth in development if enabled
    if (BYPASS_AUTH) {
      setIsAuthenticated(true);
      setIsChecking(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/auth?redirect=/admin", { replace: true });
          return;
        }

        // Check if email is verified (for production, enable this check)
        // Uncomment the following block when email verification is required:
        /*
        const { data: { user } } = await supabase.auth.getUser();
        if (!user?.email_confirmed_at) {
          navigate("/auth?message=verify-email", { replace: true });
          return;
        }
        */

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        navigate("/auth?redirect=/admin", { replace: true });
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          navigate("/auth?redirect=/admin", { replace: true });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Show loading while checking authentication
  if (isChecking || (isAuthenticated && permissionsLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-md p-8">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  // Not authenticated - will redirect via useEffect
  if (!isAuthenticated && !BYPASS_AUTH) {
    return null;
  }

  // Check role-based access (skip in bypass mode)
  if (!BYPASS_AUTH && requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = hasAnyRole(requiredRoles);
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Required role: {requiredRoles.join(" or ")}
            </p>
          </div>
        </div>
      );
    }
  }

  // Check permission-based access (skip in bypass mode)
  if (!BYPASS_AUTH && requiredPermission) {
    const hasAccess = hasPermission(requiredPermission.resource, requiredPermission.action);
    if (!hasAccess) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Required permission: {requiredPermission.resource}:{requiredPermission.action}
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
