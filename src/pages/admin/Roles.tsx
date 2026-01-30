import { useState, useEffect } from "react";
import { Shield, Users, UserCog, User, Search, MoreHorizontal } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useUserRoles, UserWithRoles } from "@/hooks/useUserRoles";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import PermissionEditor from "@/components/admin/PermissionEditor";

type AppRole = Database["public"]["Enums"]["app_role"];

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) => (
  <div className="bg-card rounded-xl border p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
    </div>
  </div>
);

const RoleBadge = ({ role }: { role: AppRole }) => {
  const colors: Record<AppRole, string> = {
    admin: "bg-destructive/10 text-destructive border-destructive/20",
    manager: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    editor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    moderator: "bg-secondary/50 text-secondary-foreground border-secondary",
    user: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <Badge variant="outline" className={`${colors[role]} capitalize`}>
      {role}
    </Badge>
  );
};

const RolesPage = () => {
  const { users, stats, isLoading, addRole, removeRole, isAddingRole, isRemovingRole } =
    useUserRoles();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user ID for self-demotion prevention
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id || null);
    });
  }, []);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !search ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.roles.includes(roleFilter as AppRole);

    return matchesSearch && matchesRole;
  });

  const handleToggleRole = (userId: string, role: AppRole, hasRole: boolean) => {
    // Prevent self-demotion from admin
    if (userId === currentUserId && role === "admin" && hasRole) {
      return;
    }

    if (hasRole) {
      removeRole({ userId, role });
    } else {
      addRole({ userId, role });
    }
  };

  const getInitials = (user: UserWithRoles) => {
    if (user.full_name) {
      return user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user.email) {
      return user.email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Role Management</h1>
        <p className="text-muted-foreground">Manage user roles and permissions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Users"
          value={stats.total}
          icon={Users}
          color="bg-primary"
        />
        <StatCard
          title="Admins"
          value={stats.admins}
          icon={Shield}
          color="bg-destructive"
        />
        <StatCard
          title="Moderators"
          value={stats.moderators}
          icon={UserCog}
          color="bg-secondary"
        />
        <StatCard
          title="Regular Users"
          value={stats.users}
          icon={User}
          color="bg-accent"
        />
      </div>

      {/* Tabs for Users and Permissions */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="users" className="gap-2">
            <Users className="w-4 h-4" />
            User Roles
          </TabsTrigger>
          <TabsTrigger value="permissions" className="gap-2">
            <Shield className="w-4 h-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users by email or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="manager">Managers</SelectItem>
                <SelectItem value="editor">Editors</SelectItem>
                <SelectItem value="moderator">Moderators</SelectItem>
                <SelectItem value="user">Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Users Table */}
          <div className="bg-card rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead className="hidden md:table-cell">Joined</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No users found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.full_name || "Unnamed User"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {user.email || `User ID: ${user.user_id.slice(0, 8)}...`}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <RoleBadge key={role} role={role} />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {format(new Date(user.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                              <UserCog className="w-4 h-4 mr-2" />
                              Manage Roles
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionEditor />
        </TabsContent>
      </Tabs>

      {/* Role Management Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Roles</DialogTitle>
            <DialogDescription>
              Toggle roles for{" "}
              <span className="font-medium">
                {selectedUser?.full_name || selectedUser?.email || "this user"}
              </span>
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 py-4">
              {/* User Info */}
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedUser.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(selectedUser)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {selectedUser.full_name || "Unnamed User"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.email ||
                      `User ID: ${selectedUser.user_id.slice(0, 8)}...`}
                  </p>
                </div>
              </div>

              {/* Role Toggles */}
              <div className="space-y-4">
                {/* Admin Role */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-destructive" />
                      Admin
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Full system access and management
                    </p>
                  </div>
                  <Switch
                    checked={selectedUser.roles.includes("admin")}
                    onCheckedChange={() =>
                      handleToggleRole(
                        selectedUser.user_id,
                        "admin",
                        selectedUser.roles.includes("admin")
                      )
                    }
                    disabled={
                      isAddingRole ||
                      isRemovingRole ||
                      (selectedUser.user_id === currentUserId &&
                        selectedUser.roles.includes("admin"))
                    }
                  />
                </div>

                {/* Manager Role */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <UserCog className="w-4 h-4 text-purple-500" />
                      Manager
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Team and resource management
                    </p>
                  </div>
                  <Switch
                    checked={selectedUser.roles.includes("manager")}
                    onCheckedChange={() =>
                      handleToggleRole(
                        selectedUser.user_id,
                        "manager",
                        selectedUser.roles.includes("manager")
                      )
                    }
                    disabled={isAddingRole || isRemovingRole}
                  />
                </div>

                {/* Editor Role */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      Editor
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Content creation and editing
                    </p>
                  </div>
                  <Switch
                    checked={selectedUser.roles.includes("editor")}
                    onCheckedChange={() =>
                      handleToggleRole(
                        selectedUser.user_id,
                        "editor",
                        selectedUser.roles.includes("editor")
                      )
                    }
                    disabled={isAddingRole || isRemovingRole}
                  />
                </div>

                {/* Moderator Role */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <UserCog className="w-4 h-4 text-secondary-foreground" />
                      Moderator
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Content management and moderation
                    </p>
                  </div>
                  <Switch
                    checked={selectedUser.roles.includes("moderator")}
                    onCheckedChange={() =>
                      handleToggleRole(
                        selectedUser.user_id,
                        "moderator",
                        selectedUser.roles.includes("moderator")
                      )
                    }
                    disabled={isAddingRole || isRemovingRole}
                  />
                </div>

                {/* User Role */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      User
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Basic access (default role)
                    </p>
                  </div>
                  <Switch
                    checked={selectedUser.roles.includes("user")}
                    onCheckedChange={() =>
                      handleToggleRole(
                        selectedUser.user_id,
                        "user",
                        selectedUser.roles.includes("user")
                      )
                    }
                    disabled={isAddingRole || isRemovingRole}
                  />
                </div>
              </div>

              {selectedUser.user_id === currentUserId && (
                <p className="text-xs text-destructive bg-destructive/10 p-3 rounded-lg">
                  ⚠️ You cannot remove your own admin role to prevent lockout.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default RolesPage;
