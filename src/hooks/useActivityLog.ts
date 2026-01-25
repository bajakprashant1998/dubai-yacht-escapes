import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

export interface ActivityLog {
  id: string;
  user_id: string | null;
  user_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  entity_name: string | null;
  old_data: Json | null;
  new_data: Json | null;
  metadata: Json | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export type ActivityAction =
  | "create"
  | "update"
  | "delete"
  | "status_change"
  | "bulk_delete"
  | "bulk_update"
  | "login"
  | "logout"
  | "settings_update";

export type EntityType =
  | "booking"
  | "tour"
  | "category"
  | "inquiry"
  | "review"
  | "customer"
  | "discount"
  | "gallery"
  | "location"
  | "site_settings"
  | "email_template";

interface LogActivityParams {
  action: ActivityAction;
  entityType: EntityType;
  entityId?: string;
  entityName?: string;
  oldData?: Json;
  newData?: Json;
  metadata?: Json;
}

// Fetch activity logs with pagination
export function useActivityLogs(options?: {
  limit?: number;
  entityType?: EntityType;
  action?: ActivityAction;
}) {
  const { limit = 50, entityType, action } = options || {};

  return useQuery({
    queryKey: ["activity-logs", { limit, entityType, action }],
    queryFn: async (): Promise<ActivityLog[]> => {
      let query = supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (entityType) {
        query = query.eq("entity_type", entityType);
      }

      if (action) {
        query = query.eq("action", action);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as ActivityLog[];
    },
  });
}

// Hook to log an activity
export function useLogActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: LogActivityParams) => {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const logEntry = {
        user_id: user?.id || null,
        user_email: user?.email || null,
        action: params.action,
        entity_type: params.entityType,
        entity_id: params.entityId || null,
        entity_name: params.entityName || null,
        old_data: params.oldData || null,
        new_data: params.newData || null,
        metadata: params.metadata || null,
        user_agent: navigator.userAgent,
      };

      const { data, error } = await supabase
        .from("activity_logs")
        .insert([logEntry])
        .select()
        .single();

      if (error) {
        console.error("Failed to log activity:", error);
        // Don't throw - we don't want to break the main action if logging fails
        return null;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
}

// Delete old logs (for cleanup)
export function useDeleteOldLogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (olderThanDays: number = 90) => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const { error } = await supabase
        .from("activity_logs")
        .delete()
        .lt("created_at", cutoffDate.toISOString());

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
}

// Helper function to get action color
export function getActionColor(action: string): string {
  switch (action) {
    case "create":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "update":
    case "settings_update":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "delete":
    case "bulk_delete":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    case "status_change":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    case "bulk_update":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    case "login":
    case "logout":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
}

// Helper function to get entity icon
export function getEntityIcon(entityType: string): string {
  switch (entityType) {
    case "booking":
      return "📅";
    case "tour":
      return "🚢";
    case "category":
      return "📁";
    case "inquiry":
      return "💬";
    case "review":
      return "⭐";
    case "customer":
      return "👤";
    case "discount":
      return "🏷️";
    case "gallery":
      return "🖼️";
    case "location":
      return "📍";
    case "site_settings":
      return "⚙️";
    case "email_template":
      return "📧";
    default:
      return "📄";
  }
}

// Format action for display
export function formatAction(action: string): string {
  return action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Format entity type for display
export function formatEntityType(entityType: string): string {
  return entityType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
