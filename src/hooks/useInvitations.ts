import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface Invitation {
  id: string;
  email: string;
  roles: AppRole[];
  invited_by: string | null;
  token: string;
  status: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useInvitations = () => {
  const queryClient = useQueryClient();

  // Fetch all invitations
  const { data: invitations = [], isLoading, error } = useQuery({
    queryKey: ["invitations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_invitations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Invitation[];
    },
  });

  // Send invitation mutation
  const sendInvitation = useMutation({
    mutationFn: async ({ email, roles }: { email: string; roles: AppRole[] }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("send-invitation-email", {
        body: { email, roles },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to send invitation");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      toast.success("Invitation sent successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to send invitation: ${error.message}`);
    },
  });

  // Cancel invitation mutation
  const cancelInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from("user_invitations")
        .update({ status: "cancelled" })
        .eq("id", invitationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      toast.success("Invitation cancelled");
    },
    onError: (error: Error) => {
      toast.error(`Failed to cancel invitation: ${error.message}`);
    },
  });

  // Resend invitation mutation
  const resendInvitation = useMutation({
    mutationFn: async (invitation: Invitation) => {
      // First, cancel the old invitation
      await supabase
        .from("user_invitations")
        .update({ status: "cancelled" })
        .eq("id", invitation.id);

      // Then send a new one
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("send-invitation-email", {
        body: { email: invitation.email, roles: invitation.roles },
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to resend invitation");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      toast.success("Invitation resent successfully!");
    },
    onError: (error: Error) => {
      toast.error(`Failed to resend invitation: ${error.message}`);
    },
  });

  // Get invitation by token (for signup flow)
  const getInvitationByToken = async (token: string) => {
    const { data, error } = await supabase
      .from("user_invitations")
      .select("*")
      .eq("token", token)
      .eq("status", "pending")
      .gt("expires_at", new Date().toISOString())
      .single();

    if (error) return null;
    return data as Invitation;
  };

  // Accept invitation (mark as accepted)
  const acceptInvitation = useMutation({
    mutationFn: async ({ token, userId }: { token: string; userId: string }) => {
      // Get the invitation
      const invitation = await getInvitationByToken(token);
      if (!invitation) throw new Error("Invalid or expired invitation");

      // Mark as accepted
      const { error: updateError } = await supabase
        .from("user_invitations")
        .update({ 
          status: "accepted",
          accepted_at: new Date().toISOString(),
        })
        .eq("id", invitation.id);

      if (updateError) throw updateError;

      // Assign roles to the user
      for (const role of invitation.roles) {
        await supabase
          .from("user_roles")
          .upsert({ user_id: userId, role }, { onConflict: "user_id,role" });
      }

      return invitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to accept invitation: ${error.message}`);
    },
  });

  // Stats
  const stats = {
    total: invitations.length,
    pending: invitations.filter((i) => i.status === "pending").length,
    accepted: invitations.filter((i) => i.status === "accepted").length,
    expired: invitations.filter(
      (i) => i.status === "pending" && new Date(i.expires_at) < new Date()
    ).length,
  };

  return {
    invitations,
    isLoading,
    error,
    stats,
    sendInvitation,
    cancelInvitation,
    resendInvitation,
    acceptInvitation,
    getInvitationByToken,
  };
};
