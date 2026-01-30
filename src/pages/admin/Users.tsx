import { useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useUserManagement, ManagedUser } from "@/hooks/useUserManagement";
import { usePermissions } from "@/hooks/usePermissions";
import { useInvitations } from "@/hooks/useInvitations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCard from "@/components/admin/StatCard";
import TablePagination from "@/components/admin/TablePagination";
import InviteUserDialog from "@/components/admin/InviteUserDialog";
import InvitationsTable from "@/components/admin/InvitationsTable";
import { usePagination } from "@/hooks/usePagination";
import {
  Users,
  UserCheck,
  UserX,
  Shield,
  Search,
  MoreHorizontal,
  Edit,
  Ban,
  CheckCircle,
  Mail,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const ROLE_COLORS: Record<AppRole, string> = {
  admin: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  manager: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  editor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  moderator: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  user: "bg-secondary/50 text-secondary-foreground border-secondary",
};

const AdminUsers = () => {
  const { users, stats, isLoading, updateStatus, addRole, removeRole } = useUserManagement();
  const { isAdmin, userId } = usePermissions();
  const { stats: invitationStats } = useInvitations();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Filter users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchQuery === "" ||
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole =
        roleFilter === "all" || user.roles.includes(roleFilter as AppRole);

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Pagination
  const pagination = usePagination(filteredUsers, 10);

  const handleRoleToggle = (user: ManagedUser, role: AppRole, enabled: boolean) => {
    // Prevent self-demotion from admin
    if (role === "admin" && user.user_id === userId && !enabled) {
      return;
    }

    if (enabled) {
      addRole({ userId: user.user_id, role });
    } else {
      removeRole({ userId: user.user_id, role });
    }
  };

  const handleStatusChange = (user: ManagedUser, status: string) => {
    // Prevent self-deactivation
    if (user.user_id === userId) return;
    updateStatus({ userId: user.user_id, status });
  };

  const openUserDialog = (user: ManagedUser) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-96 bg-muted rounded-xl animate-pulse" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage users, roles, and account status
            </p>
          </div>
          <InviteUserDialog />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Users"
            value={stats.total}
            icon={Users}
            subtitle="Registered accounts"
          />
          <StatCard
            title="Active Users"
            value={stats.active}
            icon={UserCheck}
            change={`${Math.round((stats.active / stats.total) * 100) || 0}%`}
            changeType="positive"
          />
          <StatCard
            title="Verified"
            value={stats.verified}
            icon={CheckCircle}
            subtitle="Email confirmed"
          />
          <StatCard
            title="Admins"
            value={stats.byRole.admin}
            icon={Shield}
            subtitle={`${stats.byRole.manager} managers`}
          />
          <StatCard
            title="Pending Invites"
            value={invitationStats.pending}
            icon={Mail}
            subtitle={`${invitationStats.accepted} accepted`}
          />
        </div>

        {/* Tabs for Users and Invitations */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="invitations" className="gap-2">
              <Mail className="w-4 h-4" />
              Invitations
              {invitationStats.pending > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {invitationStats.pending}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

        {/* Users Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagination.paginatedItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                pagination.paginatedItems.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {user.full_name || "Unnamed User"}
                            {user.user_id === userId && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                You
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email || `ID: ${user.user_id.slice(0, 8)}...`}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <Badge
                            key={role}
                            variant="outline"
                            className={ROLE_COLORS[role]}
                          >
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "default" : "secondary"}
                        className={
                          user.status === "active"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : user.status === "suspended"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : ""
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
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
                          <DropdownMenuItem onClick={() => openUserDialog(user)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Manage Roles
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === "active" ? (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(user, "suspended")}
                              disabled={user.user_id === userId}
                              className="text-destructive"
                            >
                              <Ban className="w-4 h-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(user, "active")}
                              className="text-secondary"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <TablePagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            pageSize={pagination.pageSize}
            totalItems={pagination.totalItems}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            onPageChange={pagination.goToPage}
            onPageSizeChange={pagination.setPageSize}
          />
        </div>
          </TabsContent>

          <TabsContent value="invitations">
            <InvitationsTable />
          </TabsContent>
        </Tabs>

        {/* Role Management Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Manage User Roles</DialogTitle>
              <DialogDescription>
                {selectedUser?.full_name || selectedUser?.email || "User"} - Toggle roles on/off
              </DialogDescription>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-4 py-4">
                {(["admin", "manager", "editor", "moderator", "user"] as AppRole[]).map(
                  (role) => {
                    const hasRole = selectedUser.roles.includes(role);
                    const isSelf = selectedUser.user_id === userId;
                    const isDisabled = role === "admin" && isSelf && hasRole;

                    return (
                      <div
                        key={role}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <Label className="font-medium capitalize">{role}</Label>
                          <p className="text-sm text-muted-foreground">
                            {role === "admin" && "Full system access"}
                            {role === "manager" && "Manage bookings, activities, customers"}
                            {role === "editor" && "Create and edit content"}
                            {role === "moderator" && "Approve reviews, moderate content"}
                            {role === "user" && "Default user access"}
                          </p>
                        </div>
                        <Switch
                          checked={hasRole}
                          onCheckedChange={(checked) =>
                            handleRoleToggle(selectedUser, role, checked)
                          }
                          disabled={isDisabled}
                        />
                      </div>
                    );
                  }
                )}

                {selectedUser.user_id === userId && (
                  <p className="text-sm text-destructive mt-4">
                    You cannot remove your own admin role.
                  </p>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
