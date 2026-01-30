import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Shield, Check, X } from "lucide-react";

type AppRole = Database["public"]["Enums"]["app_role"];

interface Permission {
  id: string;
  role: AppRole;
  resource: string;
  action: string;
  allowed: boolean;
}

const RESOURCES = [
  "users",
  "bookings",
  "tours",
  "services",
  "reviews",
  "gallery",
  "discounts",
  "faqs",
  "settings",
  "roles",
  "inquiries",
  "locations",
  "categories",
];

const ACTIONS = ["create", "read", "update", "delete", "manage"];

const ROLES: AppRole[] = ["admin", "manager", "editor", "moderator", "user"];

const PermissionEditor = () => {
  const [selectedRole, setSelectedRole] = useState<AppRole>("manager");
  const queryClient = useQueryClient();

  // Fetch all permissions
  const { data: permissions = [], isLoading } = useQuery({
    queryKey: ["all-permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("permissions")
        .select("*")
        .order("resource")
        .order("action");

      if (error) throw error;
      return data as Permission[];
    },
  });

  // Get permissions for selected role
  const rolePermissions = permissions.filter((p) => p.role === selectedRole);

  // Check if permission exists and is allowed
  const hasPermission = (resource: string, action: string): boolean => {
    const perm = rolePermissions.find(
      (p) => p.resource === resource && p.action === action
    );
    return perm?.allowed || false;
  };

  // Get permission ID if exists
  const getPermissionId = (resource: string, action: string): string | null => {
    const perm = rolePermissions.find(
      (p) => p.resource === resource && p.action === action
    );
    return perm?.id || null;
  };

  // Toggle permission mutation
  const togglePermission = useMutation({
    mutationFn: async ({
      resource,
      action,
      allowed,
    }: {
      resource: string;
      action: string;
      allowed: boolean;
    }) => {
      const existingId = getPermissionId(resource, action);

      if (existingId) {
        // Update existing permission
        const { error } = await supabase
          .from("permissions")
          .update({ allowed })
          .eq("id", existingId);

        if (error) throw error;
      } else {
        // Create new permission
        const { error } = await supabase.from("permissions").insert({
          role: selectedRole,
          resource,
          action,
          allowed,
        });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    },
    onError: (error) => {
      toast.error(`Failed to update permission: ${error.message}`);
    },
  });

  const handleToggle = (resource: string, action: string) => {
    // Admin role always has all permissions - don't allow changes
    if (selectedRole === "admin") {
      toast.error("Admin role always has all permissions");
      return;
    }

    const currentValue = hasPermission(resource, action);
    togglePermission.mutate({
      resource,
      action,
      allowed: !currentValue,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Role Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-foreground">
          Select Role:
        </label>
        <Select
          value={selectedRole}
          onValueChange={(v) => setSelectedRole(v as AppRole)}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                <span className="capitalize">{role}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedRole === "admin" && (
          <Badge variant="secondary" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Admin has all permissions
          </Badge>
        )}
      </div>

      {/* Permission Matrix */}
      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left p-4 font-medium text-sm text-muted-foreground">
                  Resource
                </th>
                {ACTIONS.map((action) => (
                  <th
                    key={action}
                    className="p-4 font-medium text-sm text-muted-foreground capitalize text-center"
                  >
                    {action}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RESOURCES.map((resource, idx) => (
                <tr
                  key={resource}
                  className={idx % 2 === 0 ? "bg-background" : "bg-muted/20"}
                >
                  <td className="p-4 font-medium capitalize">{resource}</td>
                  {ACTIONS.map((action) => {
                    const allowed =
                      selectedRole === "admin" ||
                      hasPermission(resource, action);
                    const isAdmin = selectedRole === "admin";

                    return (
                      <td key={action} className="p-4 text-center">
                        <div className="flex justify-center">
                          {isAdmin ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            <Checkbox
                              checked={allowed}
                              onCheckedChange={() =>
                                handleToggle(resource, action)
                              }
                              disabled={togglePermission.isPending}
                              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                            />
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          <span>Allowed</span>
        </div>
        <div className="flex items-center gap-2">
          <X className="w-4 h-4 text-destructive" />
          <span>Denied</span>
        </div>
      </div>
    </div>
  );
};

export default PermissionEditor;
