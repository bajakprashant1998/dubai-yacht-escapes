import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface Permission {
  role: AppRole;
  resource: string;
  action: string;
  allowed: boolean;
}

interface PermissionCheck {
  hasPermission: (resource: string, action: string) => boolean;
  hasAnyRole: (roles: AppRole[]) => boolean;
  isAdmin: boolean;
  isManager: boolean;
  isEditor: boolean;
  isModerator: boolean;
  userRoles: AppRole[];
  permissions: Permission[];
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: string | null;
}

export const usePermissions = (): PermissionCheck => {
  // Fetch current user
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch user roles
  const { data: userRoles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ["user-roles", userData?.id],
    queryFn: async () => {
      if (!userData?.id) return [];
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.id);

      if (error) throw error;
      return data.map((r) => r.role);
    },
    enabled: !!userData?.id,
  });

  // Fetch permissions for user's roles
  const { data: permissions = [], isLoading: permissionsLoading } = useQuery({
    queryKey: ["permissions", userRoles],
    queryFn: async () => {
      if (userRoles.length === 0) return [];
      
      const { data, error } = await supabase
        .from("permissions")
        .select("role, resource, action, allowed")
        .in("role", userRoles)
        .eq("allowed", true);

      if (error) throw error;
      return data as Permission[];
    },
    enabled: userRoles.length > 0,
  });

  const hasPermission = (resource: string, action: string): boolean => {
    // Admin has all permissions
    if (userRoles.includes("admin")) return true;
    
    return permissions.some(
      (p) => p.resource === resource && p.action === action && p.allowed
    );
  };

  const hasAnyRole = (roles: AppRole[]): boolean => {
    return roles.some((role) => userRoles.includes(role));
  };

  return {
    hasPermission,
    hasAnyRole,
    isAdmin: userRoles.includes("admin"),
    isManager: userRoles.includes("manager"),
    isEditor: userRoles.includes("editor"),
    isModerator: userRoles.includes("moderator"),
    userRoles,
    permissions,
    isLoading: userLoading || rolesLoading || permissionsLoading,
    isAuthenticated: !!userData,
    userId: userData?.id ?? null,
  };
};
