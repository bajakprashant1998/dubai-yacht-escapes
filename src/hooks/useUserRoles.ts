import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export interface UserWithRoles {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  roles: AppRole[];
}

interface RoleStats {
  total: number;
  admins: number;
  managers: number;
  editors: number;
  moderators: number;
  users: number;
}

export const useUserRoles = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all users with their roles
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async (): Promise<UserWithRoles[]> => {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, avatar_url, created_at");

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: allRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Get user emails from auth (we'll use the profiles data and join with roles)
      // Since we can't query auth.users directly, we'll get the current user's email
      // and rely on the profiles table for user identification
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      // Build a map of user_id -> roles
      const rolesMap = new Map<string, AppRole[]>();
      allRoles?.forEach((role) => {
        const existing = rolesMap.get(role.user_id) || [];
        existing.push(role.role);
        rolesMap.set(role.user_id, existing);
      });

      // Combine profiles with roles
      const usersWithRoles: UserWithRoles[] = (profiles || []).map((profile) => ({
        id: profile.id,
        user_id: profile.user_id,
        email: profile.user_id === currentUser?.id ? currentUser.email : null,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        roles: rolesMap.get(profile.user_id) || ["user"],
      }));

      return usersWithRoles;
    },
  });

  // Calculate role stats
  const stats: RoleStats = {
    total: users.length,
    admins: users.filter((u) => u.roles.includes("admin")).length,
    managers: users.filter((u) => u.roles.includes("manager")).length,
    editors: users.filter((u) => u.roles.includes("editor")).length,
    moderators: users.filter((u) => u.roles.includes("moderator")).length,
    users: users.filter((u) => u.roles.includes("user")).length,
  };

  // Add role mutation
  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });

      if (error) {
        // If it's a duplicate, ignore
        if (error.code === "23505") {
          return;
        }
        throw error;
      }

      // Log activity
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("activity_logs").insert({
        action: "add_role",
        entity_type: "user_role",
        entity_id: userId,
        entity_name: role,
        user_id: user?.id,
        user_email: user?.email,
        new_data: { role },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast({
        title: "Role added",
        description: "The role has been assigned successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Remove role mutation
  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", role);

      if (error) throw error;

      // Log activity
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("activity_logs").insert({
        action: "remove_role",
        entity_type: "user_role",
        entity_id: userId,
        entity_name: role,
        user_id: user?.id,
        user_email: user?.email,
        old_data: { role },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast({
        title: "Role removed",
        description: "The role has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    users,
    stats,
    isLoading,
    error,
    addRole: addRoleMutation.mutate,
    removeRole: removeRoleMutation.mutate,
    isAddingRole: addRoleMutation.isPending,
    isRemovingRole: removeRoleMutation.isPending,
  };
};
