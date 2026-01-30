import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

export interface ManagedUser {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  roles: AppRole[];
  email_confirmed_at: string | null;
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  verified: number;
  unverified: number;
  byRole: Record<AppRole, number>;
}

export const useUserManagement = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all users with their profiles and roles
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["managed-users"],
    queryFn: async (): Promise<ManagedUser[]> => {
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, avatar_url, phone, status, created_at, updated_at")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: allRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Build roles map
      const rolesMap = new Map<string, AppRole[]>();
      allRoles?.forEach((role) => {
        const existing = rolesMap.get(role.user_id) || [];
        existing.push(role.role);
        rolesMap.set(role.user_id, existing);
      });

      // Get current user for email lookup (only visible for self)
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      // Build user list
      const managedUsers: ManagedUser[] = (profiles || []).map((profile) => ({
        id: profile.id,
        user_id: profile.user_id,
        email: profile.user_id === currentUser?.id ? currentUser.email ?? null : null,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        phone: profile.phone,
        status: profile.status || "active",
        created_at: profile.created_at,
        updated_at: profile.updated_at,
        roles: rolesMap.get(profile.user_id) || ["user"],
        email_confirmed_at: profile.user_id === currentUser?.id 
          ? currentUser.email_confirmed_at ?? null 
          : null,
      }));

      return managedUsers;
    },
  });

  // Calculate stats
  const stats: UserStats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status !== "active").length,
    verified: users.filter((u) => u.email_confirmed_at !== null).length,
    unverified: users.filter((u) => u.email_confirmed_at === null).length,
    byRole: {
      admin: users.filter((u) => u.roles.includes("admin")).length,
      manager: users.filter((u) => u.roles.includes("manager")).length,
      editor: users.filter((u) => u.roles.includes("editor")).length,
      moderator: users.filter((u) => u.roles.includes("moderator")).length,
      user: users.filter((u) => u.roles.includes("user")).length,
    },
  };

  // Update user status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ status })
        .eq("user_id", userId);

      if (error) throw error;

      // Log activity
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("activity_logs").insert({
        action: "update_user_status",
        entity_type: "user",
        entity_id: userId,
        entity_name: status,
        user_id: user?.id,
        user_email: user?.email,
        new_data: { status },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managed-users"] });
      toast({
        title: "Status updated",
        description: "User status has been updated successfully.",
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

  // Update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async ({ 
      userId, 
      updates 
    }: { 
      userId: string; 
      updates: { full_name?: string; phone?: string } 
    }) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", userId);

      if (error) throw error;

      // Log activity
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("activity_logs").insert({
        action: "update_user_profile",
        entity_type: "user",
        entity_id: userId,
        user_id: user?.id,
        user_email: user?.email,
        new_data: updates,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managed-users"] });
      toast({
        title: "Profile updated",
        description: "User profile has been updated successfully.",
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

  // Add role mutation
  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });

      if (error) {
        if (error.code === "23505") return; // Duplicate, ignore
        throw error;
      }

      // Log activity
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("activity_logs").insert({
        action: "add_user_role",
        entity_type: "user_role",
        entity_id: userId,
        entity_name: role,
        user_id: user?.id,
        user_email: user?.email,
        new_data: { role },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managed-users"] });
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast({
        title: "Role added",
        description: "User role has been assigned successfully.",
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
        action: "remove_user_role",
        entity_type: "user_role",
        entity_id: userId,
        entity_name: role,
        user_id: user?.id,
        user_email: user?.email,
        old_data: { role },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managed-users"] });
      queryClient.invalidateQueries({ queryKey: ["user-roles"] });
      toast({
        title: "Role removed",
        description: "User role has been removed successfully.",
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
    updateStatus: updateStatusMutation.mutate,
    updateProfile: updateProfileMutation.mutate,
    addRole: addRoleMutation.mutate,
    removeRole: removeRoleMutation.mutate,
    isUpdating: 
      updateStatusMutation.isPending || 
      updateProfileMutation.isPending ||
      addRoleMutation.isPending ||
      removeRoleMutation.isPending,
  };
};
