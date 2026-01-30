import { Mail, Clock, Check, X, RefreshCw, MoreHorizontal } from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { useInvitations } from "@/hooks/useInvitations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

const RoleBadge = ({ role }: { role: AppRole }) => {
  const colors: Record<AppRole, string> = {
    admin: "bg-destructive/10 text-destructive border-destructive/20",
    manager: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    editor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    moderator: "bg-secondary/50 text-secondary-foreground border-secondary",
    user: "bg-primary/10 text-primary border-primary/20",
  };

  return (
    <Badge variant="outline" className={`${colors[role]} capitalize text-xs`}>
      {role}
    </Badge>
  );
};

const StatusBadge = ({ status, expiresAt }: { status: string; expiresAt: string }) => {
  const isExpired = status === "pending" && isPast(new Date(expiresAt));
  
  if (isExpired) {
    return (
      <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
        <Clock className="w-3 h-3 mr-1" />
        Expired
      </Badge>
    );
  }

  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          <Mail className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "accepted":
      return (
        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
          <Check className="w-3 h-3 mr-1" />
          Accepted
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground">
          <X className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const InvitationsTable = () => {
  const { invitations, isLoading, cancelInvitation, resendInvitation } = useInvitations();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (invitations.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-xl border">
        <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-1">No invitations yet</h3>
        <p className="text-sm text-muted-foreground">
          Invite team members to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Sent</TableHead>
            <TableHead className="hidden md:table-cell">Expires</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations.map((invitation) => {
            const isExpired = invitation.status === "pending" && isPast(new Date(invitation.expires_at));
            const canResend = invitation.status === "pending" || isExpired;
            const canCancel = invitation.status === "pending" && !isExpired;

            return (
              <TableRow key={invitation.id}>
                <TableCell>
                  <span className="font-medium">{invitation.email}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {invitation.roles.map((role) => (
                      <RoleBadge key={role} role={role} />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={invitation.status} expiresAt={invitation.expires_at} />
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                  {formatDistanceToNow(new Date(invitation.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                  {format(new Date(invitation.expires_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  {(canResend || canCancel) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canResend && (
                          <DropdownMenuItem
                            onClick={() => resendInvitation.mutate(invitation)}
                            disabled={resendInvitation.isPending}
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Resend Invitation
                          </DropdownMenuItem>
                        )}
                        {canCancel && (
                          <DropdownMenuItem
                            onClick={() => cancelInvitation.mutate(invitation.id)}
                            disabled={cancelInvitation.isPending}
                            className="text-destructive"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel Invitation
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvitationsTable;
